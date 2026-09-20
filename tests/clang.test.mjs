import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Worker} from 'node:worker_threads';
const base=new URL('../vendor/clang/',import.meta.url);
const resources={shared:readFileSync(new URL('shared.js',base),'utf8')};
for(const name of ['clang','lld','memfs','sysroot.tar']){const b=readFileSync(new URL(name,base));resources[name]=b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);}
const engine=readFileSync(new URL('../clang-engine.js',import.meta.url),'utf8');
function run(code,language='c') {return new Promise((resolve,reject)=>{
 const worker=new Worker(`const {parentPort}=require('node:worker_threads');let onmessage;const postMessage=m=>parentPort.postMessage(m);${engine};clangWorkerMain();parentPort.on('message',data=>onmessage({data}));`,{eval:true});
 let timer=setTimeout(()=>finish({type:'timeout'}),30000);
 const finish=value=>{clearTimeout(timer);worker.terminate();resolve(value);};
 worker.on('error',e=>{clearTimeout(timer);worker.terminate();reject(e);});
 worker.on('message',m=>{if(m.type==='executing'){clearTimeout(timer);timer=setTimeout(()=>finish({type:'timeout'}),2000);}else finish(m);});
 worker.postMessage({code,language,resources});
});}
test('browser toolchain compiles real C and C++17, reports errors and stops runaway code',async()=>{
 assert.equal((await run('#include <stdio.h>\nint main(void){printf("42");}')).output,'42');
 assert.equal((await run('#include <iostream>\n#include <optional>\nint main(){std::optional<int> n=42;std::cout<<*n;}','cpp')).output,'42');
 assert.equal((await run('int main(void){invalid;}')).type,'error');
 assert.equal((await run('int main(void){for(;;){}}')).type,'timeout');
});
