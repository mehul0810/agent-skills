#!/usr/bin/env node
import {readFile, writeFile, mkdir, stat, lstat} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {validateConfig, renderSvg, titleLines, transitionCue, MODES} from '../assets/motion-starter/scene.mjs';

const self = fileURLToPath(import.meta.url);
const scenePath = fileURLToPath(new URL('../assets/motion-starter/scene.mjs', import.meta.url));
const colorFilter = 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv444p,colorspace=ispace=bt709:iprimaries=bt709:itrc=srgb:irange=tv:all=bt709:range=tv:format=yuv420p';
const help = `Usage: node product-video-producer/scripts/render-motion-starter.mjs --playwright ABS_MODULE --ffmpeg ABS_EXE --ffprobe ABS_EXE --output ABS_NEW_DIR [--font ABS_TTF_OTF_WOFF] [--profile preview|full] [--mode ${MODES.join('|')}] [--config ABS_JSON] [--start-frame N --end-frame N] [--poster-frame N]\nThe output directory must not exist. Ranges are start-inclusive, end-exclusive.\n`;
const options = new Set(['playwright','ffmpeg','ffprobe','output','font','profile','mode','config','start-frame','end-frame','poster-frame']);
const abs = (v, label) => { if (!v || !path.isAbsolute(v) || path.normalize(v) !== v) throw new Error(`${label} must be a normalized absolute path`); return v; };
const uint = (v,label) => { if (!/^(0|[1-9][0-9]*)$/.test(v ?? '')) throw new Error(`${label} must be an unsigned integer`); return Number(v); };
export function parseArgs(argv) {
  if (argv.length === 1 && argv[0] === '--help') return {help:true};
  const o = {};
  for (let i=0;i<argv.length;i+=2) {
    const key = argv[i]?.startsWith('--') ? argv[i].slice(2) : '';
    if (!options.has(key) || !argv[i+1] || argv[i+1].startsWith('--') || key in o) throw new Error(`Invalid or repeated argument: ${argv[i]}`);
    o[key] = argv[i+1];
  }
  for (const key of ['playwright','ffmpeg','ffprobe','output']) abs(o[key], key);
  if (o.font) {
    abs(o.font,'font');
    if (!/\.(ttf|otf|woff2?)$/i.test(o.font)) throw new Error('Font must be TTF, OTF, WOFF, or WOFF2');
  }
  if (o.config) abs(o.config,'config');
  if (o.profile && !['preview','full'].includes(o.profile)) throw new Error('Invalid profile');
  if (o.mode && !MODES.includes(o.mode)) throw new Error('Invalid mode');
  if (o['start-frame'] !== undefined) o.start = uint(o['start-frame'],'start-frame');
  if (o['end-frame'] !== undefined) o.end = uint(o['end-frame'],'end-frame');
  if (o['poster-frame'] !== undefined) o.poster = uint(o['poster-frame'],'poster-frame');
  if (o.output === '/' || o.output === '/private' || o.output === '/private/tmp' || o.output === '/tmp') throw new Error('Unsafe output target');
  if (existsSync(o.output)) throw new Error('Output already exists; refusing overwrite');
  return o;
}
const sha = (buf) => createHash('sha256').update(buf).digest('hex');
async function run(exe,args) {
  return new Promise((resolve,reject) => {
    const p = spawn(exe,args,{stdio:['ignore','pipe','pipe']}); let out='',err='';
    p.stdout.on('data',d=>out+=d); p.stderr.on('data',d=>err+=d);
    p.on('error',reject); p.on('close',code=>code === 0 ? resolve({out,err}) : reject(new Error(`${path.basename(exe)} exited ${code}: ${err.slice(-1600)}`)));
  });
}
async function executable(file,label) {
  const s = await stat(file);
  if (!s.isFile() || !(s.mode & 0o111)) throw new Error(`${label} must be an executable file`);
}
export async function main(argv) {
  const o = parseArgs(argv);
  if (o.help) { process.stdout.write(help); return; }
  const parent = path.dirname(o.output);
  const ps = await lstat(parent);
  if (!ps.isDirectory() || ps.isSymbolicLink()) throw new Error('Output parent must be a real directory');
  await executable(o.ffmpeg,'ffmpeg'); await executable(o.ffprobe,'ffprobe');
  const moduleStat = await stat(o.playwright);
  if (!moduleStat.isFile()) throw new Error('Playwright module must be a file');
  const user = o.config ? JSON.parse(await readFile(o.config,'utf8')) : {};
  if (!user || Array.isArray(user) || typeof user !== 'object') throw new Error('Config must be an object');
  const profile = o.profile ?? 'preview';
  const c = validateConfig({...user,mode:o.mode ?? user.mode ?? 'clean',width:profile === 'preview' ? 960 : 3840,height:profile === 'preview' ? 540 : 2160});
  c.copy.forEach(titleLines);
  const total = c.duration*c.fps, start = o.start ?? 0, end = o.end ?? total;
  if (start >= end || end > total || (o.poster !== undefined && o.poster >= total)) throw new Error('Invalid frame range');
  if (end-start > 3600) throw new Error('Range exceeds 3600 frames');
  const sourceIdentity = {sceneSha256:sha(await readFile(scenePath)),rendererSha256:sha(await readFile(self))};
  const {chromium} = await import(pathToFileURL(o.playwright).href);
  if (!chromium?.launch) throw new Error('Playwright module has no chromium.launch');
  const fontBytes = o.font ? await readFile(o.font) : null;
  const fontFormat = o.font?.toLowerCase().endsWith('.woff2') ? 'woff2' : o.font?.toLowerCase().endsWith('.woff') ? 'woff' : o.font?.toLowerCase().endsWith('.otf') ? 'opentype' : 'truetype';
  const fontCss = fontBytes ? `@font-face{font-family:'Motion Title';src:url(data:font/${fontFormat};base64,${fontBytes.toString('base64')}) format('${fontFormat}');font-weight:600}` : '';
  await mkdir(o.output); // exclusive: failure leaves no replacement of prior render
  const frames = path.join(o.output,'frames'); await mkdir(frames);
  const browser = await chromium.launch({headless:true});
  const chromiumVersion = browser.version();
  try {
    const page = await browser.newPage({viewport:{width:c.width,height:c.height},deviceScaleFactor:1});
    const display = async (svg) => {
      await page.setContent(`<html><head><style>html,body{margin:0;background:${c.palette[0]}}svg{display:block}${fontCss}</style></head><body>${svg}</body></html>`,{waitUntil:'load'});
      await page.evaluate(async () => {
        await document.fonts.ready;
        const title = document.querySelector('[data-fit-title]');
        const lines = [...title.querySelectorAll('tspan')];
        let size = Number(title.getAttribute('font-size'));
        while (Math.max(...lines.map(line => line.getComputedTextLength())) > 810 && size > 48) {
          size -= 2;
          title.setAttribute('font-size',String(size));
        }
        if (Math.max(...lines.map(line => line.getComputedTextLength())) > 810) throw new Error('Title cannot fit safely');
      });
    };
    for (let frame=start; frame<end; frame++) {
      const svg = renderSvg(frame,c);
      await display(svg);
      await page.screenshot({path:path.join(frames,`frame-${String(frame-start).padStart(6,'0')}.png`),animations:'disabled'});
    }
    if (o.poster !== undefined) {
      await display(renderSvg(o.poster,c));
      await page.screenshot({path:path.join(o.output,'poster.png'),animations:'disabled'});
    }
  } finally { await browser.close(); }
  const video = path.join(o.output,'review.mp4');
  const cue = transitionCue(c);
  const cueOffsetSeconds = c.mode === 'audio-offset' ? 0.45 : 0;
  const cueTime = cue.seconds + cueOffsetSeconds - start/c.fps;
  const audioEnabled = cueTime >= 0 && cueTime < (end-start)/c.fps;
  const args = ['-hide_banner','-loglevel','error','-nostdin','-y','-framerate',String(c.fps),'-start_number','0','-i',path.join(frames,'frame-%06d.png')];
  if (audioEnabled) {
    args.push('-f','lavfi','-i','sine=frequency=880:sample_rate=48000:duration=0.15','-filter_complex',`[1:a]adelay=${Math.round(cueTime*1000)}|${Math.round(cueTime*1000)},apad,atrim=duration=${(end-start)/c.fps}[a]`,'-map','0:v','-map','[a]');
  } else args.push('-map','0:v');
  args.push('-frames:v',String(end-start),'-vf',colorFilter,'-c:v','libx264','-preset','medium','-crf',profile === 'preview' ? '20' : '17','-pix_fmt','yuv420p','-r',String(c.fps),'-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709');
  if (audioEnabled) args.push('-c:a','aac','-ar','48000','-b:a','128k');
  args.push('-movflags','+faststart',video);
  await run(o.ffmpeg,args);
  const probe = JSON.parse((await run(o.ffprobe,['-v','error','-show_streams','-show_format','-of','json',video])).out);
  if (sha(await readFile(scenePath)) !== sourceIdentity.sceneSha256 || sha(await readFile(self)) !== sourceIdentity.rendererSha256) {
    throw new Error('Source changed during render; receipt withheld');
  }
  const receipt = {
    status:'draft-render-not-accepted-master', profile, mode:c.mode, config:c, range:{start,end,frameCount:end-start},posterFrame:o.poster ?? null,
    source:sourceIdentity,
    toolchain:{node:process.version,playwrightModule:o.playwright,playwrightModuleSha256:sha(await readFile(o.playwright)),playwrightVersion:JSON.parse(await readFile(path.join(path.dirname(o.playwright),'package.json'),'utf8')).version,chromiumVersion,ffmpeg:o.ffmpeg,ffmpegVersion:(await run(o.ffmpeg,['-version'])).out.split('\n')[0],ffprobe:o.ffprobe,ffprobeVersion:(await run(o.ffprobe,['-version'])).out.split('\n')[0],font:fontBytes ? {path:o.font,sha256:sha(fontBytes),format:fontFormat} : {status:'platform-fallback-nonreproducible',family:'Iowan Old Style, Georgia, serif'}},
    audioCue:{...cue,offsetSeconds:cueOffsetSeconds,renderedInRange:audioEnabled,synthetic:true},
    color:{browserPngAssumption:'sRGB full-range RGB',conversionFilter:colorFilter,tags:'bt709 SDR metadata requested',displayGrade:'unverified; probe and filter execution do not establish monitored color accuracy'},
    output:{path:video,sha256:sha(await readFile(video)),probe},
    caveats:['Illustrative vector content; no real product UI or claims.','Synthetic sine cue; no music or narration.','Browser PNG sRGB interpretation and display appearance are not independently graded.','Requires human normal-speed playback, accessibility, brand, rights, and independent manifest verification before acceptance.']
  };
  await writeFile(path.join(o.output,'receipt.json'),JSON.stringify(receipt,null,2)+'\n');
  process.stdout.write(`${video}\n`);
}
if (process.argv[1] && path.resolve(process.argv[1]) === self) main(process.argv.slice(2)).catch(e=>{process.stderr.write(`${e.message}\n`);process.exitCode=1;});
