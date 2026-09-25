#!/usr/bin/env node
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { planContext } from '@mehul0810/agent-harness';

export function parseArgs(args) {
  const parsed = { config: 'agent-harness.config.json', routes: [], json: false };
  let configSeen = false;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === '--json') {
      parsed.json = true;
      continue;
    }
    if (arg !== '--route' && arg !== '--config') {
      throw new Error(`Unknown argument: ${arg}`);
    }
    const value = args[index + 1];
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`${arg} requires a value.`);
    }
    if (value.trim() === '') {
      throw new Error(`${arg} cannot be empty.`);
    }
    if (arg === '--route') {
      parsed.routes.push(value);
    } else {
      if (configSeen) throw new Error('--config may be specified only once.');
      configSeen = true;
      parsed.config = value;
    }
    index += 1;
  }
  if (parsed.routes.length === 0) throw new Error('At least one --route is required.');
  parsed.routes = [...new Set(parsed.routes)];
  return parsed;
}

export async function buildContextBundle(configPath, routes) {
  if (!Array.isArray(routes) || routes.length === 0 || routes.some((route) => typeof route !== 'string' || route.trim() === '')) {
    throw new TypeError('At least one non-empty string route is required.');
  }
  const selectedRoutes = [...new Set(routes)];
  const routeResults = [];
  const files = new Map();
  const diagnostics = [];
  let allRoutesPassed = true;

  for (const route of selectedRoutes) {
    const result = await planContext(configPath, route);
    const routeDiagnostics = [...(result.diagnostics ?? [])];
    for (const file of result.summary?.files ?? []) {
      let entry = files.get(file.path);
      if (!entry) {
        entry = { path: file.path, words: file.words, routes: [], wordCountsByRoute: { [route]: file.words } };
        files.set(file.path, entry);
      } else {
        entry.wordCountsByRoute[route] = file.words;
        if (entry.words !== null && entry.words !== file.words) {
          entry.words = null;
          const diagnostic = {
            code: 'CONTEXT_MANIFEST_INCONSISTENT',
            message: `Configured file ${JSON.stringify(file.path)} changed word count while routes were being planned; overlap totals are unavailable.`,
            severity: 'error',
            path: file.path,
          };
          routeDiagnostics.push(diagnostic);
          diagnostics.push({ ...diagnostic, route });
          allRoutesPassed = false;
        }
      }
      if (!entry.routes.includes(route)) entry.routes.push(route);
    }
    if (!result.ok) allRoutesPassed = false;
    routeResults.push({
      route,
      ok: result.ok && !routeDiagnostics.some(({ code }) => code === 'CONTEXT_MANIFEST_INCONSISTENT'),
      command: result.command,
      exitCode: result.exitCode,
      diagnostics: routeDiagnostics,
      warnings: result.warnings ?? [],
      budget: result.summary ? {
        actualWords: result.summary.actualWords,
        maxWords: result.summary.maxWords,
        headroomWords: result.summary.headroomWords,
      } : null,
    });
  }

  const manifest = [...files.values()].map((file) => {
    const { wordCountsByRoute, ...entry } = file;
    return file.words === null ? { ...entry, wordCountsByRoute } : entry;
  });
  const naiveSummedWords = routeResults.reduce((total, result) => total + (result.budget?.actualWords ?? 0), 0);
  const uniqueWords = manifest.some((file) => file.words === null) ? null : manifest.reduce((total, file) => total + file.words, 0);
  const ok = allRoutesPassed && routeResults.every((result) => result.ok);
  const failedRoute = routeResults.find((result) => !result.ok);
  return {
    ok,
    command: 'plan-context-bundle',
    configPath: path.resolve(configPath),
    exitCode: ok ? 0 : (failedRoute?.exitCode || 1),
    complete: ok,
    routes: routeResults,
    files: manifest,
    diagnostics,
    consistency: 'Routes are planned sequentially; this manifest is not an atomic filesystem snapshot.',
    summary: {
      routeCount: selectedRoutes.length,
      fileCount: manifest.length,
      naiveSummedWords,
      uniqueWords,
      avoidedDuplicateWords: uniqueWords === null ? null : naiveSummedWords - uniqueWords,
    },
  };
}

export function formatBundle(bundle) {
  const lines = [`Context bundle: ${bundle.ok ? 'PASS' : 'FAIL'}${bundle.complete ? '' : ' (incomplete)'}`];
  for (const route of bundle.routes) {
    lines.push(`${route.ok ? 'PASS' : 'FAIL'} route ${JSON.stringify(route.route)}`);
    for (const diagnostic of route.diagnostics ?? []) {
      lines.push(`  ERROR ${diagnostic.code}: ${diagnostic.message}`);
    }
    for (const warning of route.warnings ?? []) {
      lines.push(`  WARNING ${warning.code}: ${warning.message}`);
    }
  }
  if (bundle.summary) {
    lines.push('Files (configured paths; contents are not included):');
    for (const file of bundle.files) {
      lines.push(`- ${file.path}: ${file.words === null ? `inconsistent word counts (${JSON.stringify(file.wordCountsByRoute)})` : `${file.words} words`}; routes: ${file.routes.join(', ')}`);
    }
    lines.push(`Word counts only: naive route sum ${bundle.summary.naiveSummedWords}; unique-file words ${bundle.summary.uniqueWords ?? 'unavailable'}; avoided duplicate words ${bundle.summary.avoidedDuplicateWords ?? 'unavailable'}.`);
    lines.push('These are not token-savings or actual model-usage measurements.');
    lines.push(bundle.consistency);
    if (!bundle.complete) lines.push('An incomplete manifest is not proof of a valid complete bundle; inspect route errors before using it.');
  }
  return lines.join('\n');
}

async function main(args) {
  let parsed;
  try {
    parsed = parseArgs(args);
  } catch (error) {
    console.error(`ERROR INVALID_INPUT: ${error.message}`);
    return 2;
  }
  const configPath = path.resolve(process.cwd(), parsed.config);
  const bundle = await buildContextBundle(configPath, parsed.routes);
  process.stdout.write(`${parsed.json ? JSON.stringify(bundle, null, 2) : formatBundle(bundle)}\n`);
  return bundle.exitCode;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.exitCode = await main(process.argv.slice(2));
}
