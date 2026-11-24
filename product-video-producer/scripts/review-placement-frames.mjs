#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, realpathSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const usage = `Usage: node review-placement-frames.mjs --input VIDEO --width PIXELS --times SECONDS[,SECONDS...] --output NEW_DIR [--overlay GUIDE.png] [--assume-square]

Extract PNG frames from an encoded video at a logical player width. Optionally
composite a local transparent PNG guide with the same aspect ratio. The output
directory must not already exist. Requires ffmpeg and ffprobe on PATH. Only
local regular MOV/MP4 and Matroska/WebM videos and PNG guides are accepted.
Guide alpha is normalized to 8-bit RGBA; fully transparent or opaque guides,
rotation/display matrices and non-square pixels are rejected. For an untagged
video, use --assume-square only if the source composition confirms square pixels. Frames are not
proof of playback, legibility, or any platform's safe areas.`;

export function parseArgs(args) {
  if (args.length === 1 && args[0] === '--help') return { help: true };
  const options = {};
  for (let i = 0; i < args.length;) {
    const key = args[i++];
    if (Object.hasOwn(options, key)) throw new Error('Duplicate option');
    if (key === '--assume-square') { options[key] = true; continue; }
    if (!['--input', '--width', '--times', '--output', '--overlay'].includes(key) || !args[i] || args[i].startsWith('--')) throw new Error('Invalid or missing option');
    options[key] = args[i++];
  }
  for (const key of ['--input', '--width', '--times', '--output']) if (!options[key]) throw new Error(`Missing ${key}`);
  if (!/^[1-9]\d*$/.test(options['--width']) || Number(options['--width']) > 8192) throw new Error('Width must be an integer from 1 to 8192');
  const parts = options['--times'].split(',');
  if (parts.length > 100 || parts.some(x => !/^(?:\d+)(?:\.\d+)?$/.test(x) || !Number.isFinite(Number(x)))) throw new Error('Times must be comma-separated non-negative seconds (maximum 100)');
  return { input: resolve(options['--input']), width: Number(options['--width']), times: parts.map(Number), output: resolve(options['--output']), overlay: options['--overlay'] && resolve(options['--overlay']), assumeSquare: options['--assume-square'] === true };
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`${command} failed: ${result.error?.message || result.stderr?.trim() || `exit ${result.status}`}`);
  return result;
}
const inputFlags = format => ['-protocol_whitelist', 'file,pipe', '-format_whitelist', format];
function probe(path, format) {
  if (!statSync(path).isFile()) throw new Error('Input must be a local regular file');
  return JSON.parse(run('ffprobe', ['-v', 'error', ...inputFlags(format), '-show_streams', '-show_format', '-of', 'json', path]).stdout);
}
function videoStream(info) {
  const stream = info.streams?.find(s => s.codec_type === 'video' && !s.disposition?.attached_pic);
  if (!stream || !stream.width || !stream.height) throw new Error('A video stream with dimensions is required');
  return stream;
}
export function geometry(stream) {
  if (stream.sample_aspect_ratio && !['1:1', 'N/A', '0:1'].includes(stream.sample_aspect_ratio)) throw new Error('Non-square sample aspect ratio is unsupported');
  if ((stream.tags?.rotate !== undefined && (!Number.isFinite(Number(stream.tags.rotate)) || Number(stream.tags.rotate) !== 0)) || stream.side_data_list?.some(x => x.side_data_type === 'Display Matrix' || (x.rotation !== undefined && (!Number.isFinite(Number(x.rotation)) || Number(x.rotation) !== 0)))) throw new Error('Rotation or display matrix is unsupported');
}
export function main(args) {
  const options = parseArgs(args);
  if (options.help) { console.log(usage); return; }
  const info = probe(options.input, 'mov,matroska,webm');
  const source = videoStream(info);
  geometry(source);
  if (source.sample_aspect_ratio !== '1:1') {
    if (!options.assumeSquare) throw new Error('No pixel-aspect tag: confirm square pixels in the source composition before using --assume-square');
    console.error('No pixel-aspect tag: using caller-confirmed square pixels');
  }
  const duration = [source.duration, info.format?.duration].map(Number).find(n => Number.isFinite(n) && n > 0);
  if (!Number.isFinite(duration) || duration <= 0 || options.times.some(t => t >= duration)) throw new Error('Each sample time must be less than the known video duration');
  const height = Math.max(1, Math.round(options.width * source.height / source.width));
  if (height > 8192) throw new Error('Resulting height exceeds 8192 pixels');
  if (options.overlay) {
    const guide = videoStream(probe(options.overlay, 'png_pipe'));
    geometry(guide);
    if (guide.codec_name !== 'png' || guide.width * source.height !== guide.height * source.width) throw new Error('Guide must be a same-aspect PNG');
    const alpha = run('ffmpeg', ['-v', 'info', ...inputFlags('png_pipe'), '-i', options.overlay, '-frames:v', '1', '-vf', 'format=rgba,alphaextract,signalstats,metadata=print', '-f', 'null', '-']);
    const min = /lavfi\.signalstats\.YMIN=([\d.]+)/.exec(alpha.stderr + alpha.stdout);
    const max = /lavfi\.signalstats\.YMAX=([\d.]+)/.exec(alpha.stderr + alpha.stdout);
    if (!min || !max || Number(min[1]) >= 255 || Number(max[1]) <= 0) throw new Error('Guide must have both visible and transparent pixels');
  }
  // Exclusive directory creation prevents overwriting any existing output.
  mkdirSync(options.output);
  for (const [index, time] of options.times.entries()) {
    const stem = `frame-${String(index + 1).padStart(3, '0')}`;
    const clean = join(options.output, `${stem}-clean.png`);
    run('ffmpeg', ['-v', 'error', '-nostdin', '-noautorotate', ...inputFlags('mov,matroska,webm'), '-ss', String(time), '-i', options.input, '-map', `0:${source.index}`, '-frames:v', '1', '-vf', `scale=${options.width}:${height},setsar=1`, '-n', clean]);
    if (!existsSync(clean)) throw new Error(`No frame was decoded at ${time} seconds`);
    if (options.overlay) {
      const guided = join(options.output, `${stem}-guided.png`);
      run('ffmpeg', ['-v', 'error', '-nostdin', ...inputFlags('png_pipe'), '-i', clean, ...inputFlags('png_pipe'), '-i', options.overlay, '-filter_complex', `[1:v]format=rgba,scale=${options.width}:${height}[guide];[0:v][guide]overlay=0:0:format=auto`, '-frames:v', '1', '-n', guided]);
    }
  }
  console.log(`Wrote ${options.times.length} clean${options.overlay ? ' and guided' : ''} frame(s) to ${options.output}`);
}

if (process.argv[1] && process.argv[1] !== '-' && existsSync(process.argv[1]) && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (error) { console.error(`Error: ${error.message}`); process.exitCode = 1; }
}
