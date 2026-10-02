import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const paths=process.argv.slice(2).map(path=>resolve(path));
if(paths.length!==5) throw new Error('Provide explicit Skills, Loop, Decide, Harness and Book roots');
const [skills,loop,decide,harness,book]=paths;
const {validateRoutingContract}=await import(pathToFileURL(resolve(harness,'src/index.js')).href);
const descriptors=paths.map(path=>JSON.parse(readFileSync(resolve(path,'contracts/routing-policy.json'))));
for(const descriptor of descriptors){const result=validateRoutingContract(descriptor);if(!result.ok)throw new Error(result.errors.join('; '));}
if(descriptors.some(value=>JSON.stringify(value)!==JSON.stringify(descriptors[0])))throw new Error('Routing descriptor drift');
const policy=JSON.parse(readFileSync(resolve(loop,descriptors[0].canonical_path)));
if(policy.policy_version!==descriptors[0].policy_version)throw new Error('Canonical policy version drift');
const {validateRoutingPolicy}=await import(pathToFileURL(resolve(loop,'scripts/model-routing.mjs')).href);
const errors=validateRoutingPolicy(policy);if(errors.length)throw new Error(errors.join('; '));
const shadow=JSON.parse(readFileSync(resolve(decide,'policy/operating-policy.json')));
if(shadow.mode!=='shadow'||shadow.automaticAdapters.length||Object.values(shadow.routeModes).some(mode=>mode!=='shadow'))throw new Error('Decide shadow boundary drift');
console.log(`PASS: five descriptors match ${policy.policy_version}; canonical boundaries valid; Decide shadow-only. No installation or adoption implied.`);
