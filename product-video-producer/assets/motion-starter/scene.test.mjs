import test from 'node:test';
import assert from 'node:assert/strict';
import {validateConfig, shotAt, titleOpacity, titleLines, transitionCue, renderSvg, MODES} from './scene.mjs';
test('four beats and exact frame bounds', () => {
  const c = validateConfig({});
  assert.deepEqual([0,150,300,450].map((f) => shotAt(f,c).shot), [0,1,2,3]);
  assert.throws(() => shotAt(600,c));
});
test('rejects hostile parameters and escapes visible copy', () => {
  assert.throws(() => validateConfig({palette:['red','#ffffff','#ffffff','#ffffff']}));
  assert.throws(() => validateConfig({mode:'nope'}));
  assert.throws(() => validateConfig({fps:0}));
  assert.match(renderSvg(0,{copy:['<script>','B','C','D']}), /&lt;script&gt;/);
  assert.equal(MODES.length,8);
});
test('short title defect is actually absent by mid-shot', () => {
  assert.equal(titleOpacity(0,0.5,'shorttitlehold'),0);
  assert.equal(titleOpacity(0,0.5,'clean'),1);
  assert.equal(titleOpacity(1,0.5,'shorttitlehold'),1);
});
test('cue follows workflow transition at other durations', () => {
  assert.deepEqual(transitionCue({duration:12,fps:24}),{frame:72,seconds:3,event:'workflow-beat-transition'});
  assert.equal(shotAt(72,{duration:12,fps:24}).shot,1);
  assert.equal(transitionCue({duration:5,fps:13}).frame,17);
  assert.equal(shotAt(16,{duration:5,fps:13}).shot,0);
  assert.equal(shotAt(17,{duration:5,fps:13}).shot,1);
  assert.deepEqual(titleLines('From signal to sequence'),['From signal to','sequence']);
  assert.throws(() => titleLines('Supercalifragilisticexpialidocious'));
});
test('evidence title stays below the fixed section label', () => {
  const svg = renderSvg(330);
  const labelY = Number(svg.match(/<text x="144" y="(\d+)"[^>]*>STUDIO/)[1]);
  const titleY = Number(svg.match(/data-fit-title x="\d+" y="(\d+)"/)[1]);
  assert.ok(titleY - 96 > labelY + 28 + 80);
});
