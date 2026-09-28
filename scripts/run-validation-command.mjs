import { spawn } from 'node:child_process';

export const VALIDATION_COMMAND_DEFAULTS = Object.freeze({
  timeoutMs: 120_000,
  outputLimitBytes: 16 * 1024 * 1024,
  killGraceMs: 250,
  finalDrainMs: 500,
});

function signalProcessTree(child, signal) {
  if (process.platform !== 'win32' && child.pid) {
    try {
      process.kill(-child.pid, signal);
      return;
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
  child.kill(signal);
}

function processGroupExists(pid) {
  if (process.platform === 'win32' || !pid) return false;
  try {
    process.kill(-pid, 0);
    return true;
  } catch (error) {
    if (error.code === 'ESRCH') return false;
    if (error.code === 'EPERM') return true;
    throw error;
  }
}

export function runCommand(command, args, {
  cwd,
  env,
  timeoutMs = VALIDATION_COMMAND_DEFAULTS.timeoutMs,
  outputLimitBytes = VALIDATION_COMMAND_DEFAULTS.outputLimitBytes,
  killGraceMs = VALIDATION_COMMAND_DEFAULTS.killGraceMs,
  finalDrainMs = VALIDATION_COMMAND_DEFAULTS.finalDrainMs,
} = {}) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) throw new RangeError('timeoutMs must be a positive safe integer');
  if (!Number.isSafeInteger(outputLimitBytes) || outputLimitBytes < 0) throw new RangeError('outputLimitBytes must be a non-negative safe integer');
  if (!Number.isSafeInteger(killGraceMs) || killGraceMs < 0) throw new RangeError('killGraceMs must be a non-negative safe integer');
  if (!Number.isSafeInteger(finalDrainMs) || finalDrainMs < 0) throw new RangeError('finalDrainMs must be a non-negative safe integer');
  return new Promise(resolve => {
    const startedAt = performance.now();
    const child = spawn(command, args, {
      cwd,
      env,
      detached: process.platform !== 'win32',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    });
    const chunks = { stdout: [], stderr: [] };
    let bytesCaptured = 0;
    let timedOut = false;
    let outputExceeded = false;
    let spawnError;
    let escalationTimer;
    let finalDrainTimer;
    let deadlineTimer;
    let terminationStarted = false;
    let escalationPending = false;
    let closeResult;
    let settled = false;
    let cleanupIncomplete = false;

    const append = (stream, chunk) => {
      const remaining = Math.max(0, outputLimitBytes - bytesCaptured);
      const keep = Math.min(remaining, chunk.length);
      if (keep) chunks[stream].push(chunk.subarray(0, keep));
      bytesCaptured += keep;
      if (keep < chunk.length && !outputExceeded) {
        outputExceeded = true;
        terminate();
      }
    };
    const terminate = () => {
      if (terminationStarted) return;
      terminationStarted = true;
      try {
        signalProcessTree(child, 'SIGTERM');
      } catch (error) {
        spawnError ??= error;
      }
      escalationPending = true;
      escalationTimer = setTimeout(() => {
        try {
          signalProcessTree(child, 'SIGKILL');
        } catch (error) {
          spawnError ??= error;
        }
        escalationPending = false;
        if (closeResult) finish();
        else {
          finalDrainTimer = setTimeout(() => {
            cleanupIncomplete = true;
            closeResult = { status: null, signal: 'SIGKILL' };
            child.stdout.destroy();
            child.stderr.destroy();
            child.unref();
            finish();
          }, finalDrainMs);
        }
      }, killGraceMs);
    };
    const finish = () => {
      if (settled || !closeResult || escalationPending) return;
      settled = true;
      clearTimeout(deadlineTimer);
      clearTimeout(escalationTimer);
      clearTimeout(finalDrainTimer);
      resolve({
        ...closeResult,
        error: spawnError,
        timedOut,
        outputExceeded,
        cleanupIncomplete,
        stdout: Buffer.concat(chunks.stdout).toString('utf8'),
        stderr: Buffer.concat(chunks.stderr).toString('utf8'),
        durationMs: Math.round(performance.now() - startedAt),
      });
    };

    child.stdout.on('data', chunk => append('stdout', chunk));
    child.stderr.on('data', chunk => append('stderr', chunk));
    child.on('error', error => { spawnError = error; });
    deadlineTimer = setTimeout(() => {
      timedOut = true;
      terminate();
    }, timeoutMs);
    deadlineTimer.unref?.();
    child.on('close', (status, signal) => {
      closeResult = { status, signal };
      clearTimeout(deadlineTimer);
      if (!terminationStarted && processGroupExists(child.pid)) terminate();
      finish();
    });
  });
}

export async function runValidationChecks(checks, {
  cwd,
  runner = runCommand,
  log = console.log,
  errorLog = console.error,
  commandOptions = {},
} = {}) {
  let failed = false;
  for (const [name, command, args] of checks) {
    let result;
    try {
      result = await runner(command, args, { cwd, ...commandOptions });
    } catch (error) {
      result = { status: null, error, durationMs: 0, stdout: '', stderr: '' };
    }
    const pass = result.status === 0 && !result.error && !result.timedOut && !result.outputExceeded;
    log(`${pass ? 'PASS' : 'FAIL'} ${name} (${result.durationMs ?? 0} ms)`);
    if (!pass) {
      failed = true;
      if (result.stdout) errorLog(result.stdout);
      if (result.stderr) errorLog(result.stderr);
      if (result.timedOut) errorLog(`Timed out after ${commandOptions.timeoutMs ?? VALIDATION_COMMAND_DEFAULTS.timeoutMs} ms`);
      if (result.outputExceeded) errorLog(`Output exceeded ${commandOptions.outputLimitBytes ?? VALIDATION_COMMAND_DEFAULTS.outputLimitBytes} bytes`);
      if (result.cleanupIncomplete) errorLog('Process streams did not close after SIGKILL escalation; descendant cleanup is unverified');
      if (result.error) errorLog(result.error.message);
    } else {
      const warnings = `${result.stdout}\n${result.stderr}`.split('\n').filter(line => /WARNING|low headroom/.test(line));
      for (const warning of warnings) log(warning);
    }
  }
  return !failed;
}
