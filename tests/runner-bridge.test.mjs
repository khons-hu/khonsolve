import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
test('cancel terminates the isolated worker and revokes its URL',()=>{
 let listener,terminated=0,revoked=0;
 const parent={postMessage(){}};
 const context={parent,addEventListener:(_,fn)=>listener=fn,workerMain(){},pythonWorkerMain(){},clangWorkerMain(){},Blob,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL:()=>revoked++},Worker:class{postMessage(){}terminate(){terminated++;}},setTimeout:()=>1,clearTimeout(){}};
 vm.runInNewContext(readFileSync(new URL('../runner.js',import.meta.url),'utf8'),context);
 listener({source:parent,data:{type:'run',code:'while(true){}',tests:[],language:'javascript',resources:{},runId:1}});
 listener({source:parent,data:{type:'cancel'}});
 assert.equal(terminated,1);assert.equal(revoked,1);
});
