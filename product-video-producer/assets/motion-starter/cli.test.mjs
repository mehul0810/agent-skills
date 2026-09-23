import test from 'node:test';
import assert from 'node:assert/strict';
import {parseArgs} from '../../scripts/render-motion-starter.mjs';
const base=['--playwright','/tmp/p.mjs','--ffmpeg','/tmp/f','--ffprobe','/tmp/fp','--output','/tmp/new-output'];
test('safe CLI parsing',()=>{
  assert.equal(parseArgs(base).output,'/tmp/new-output');
  assert.throws(()=>parseArgs([...base,'--mode','wrong']));
  assert.throws(()=>parseArgs([...base,'--start-frame','-1']));
  assert.throws(()=>parseArgs(base.map(x=>x==='/tmp/new-output'?'relative':x)));
  assert.throws(()=>parseArgs(base.map(x=>x==='/tmp/new-output'?'/tmp':x)));
  assert.throws(()=>parseArgs([...base,'--output','/tmp/again']));
  assert.throws(()=>parseArgs([...base,'--font','/tmp/font.svg']));
});
