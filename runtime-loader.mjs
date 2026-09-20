const cache={};
async function get(path,binary=false){const r=await fetch(path,{credentials:'omit',signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(`Runtime download failed (${r.status}). Try again when online.`);return binary?r.arrayBuffer():r.text();}
export async function resources(language){
 if(language==='javascript')return {};
 if(language==='c'||language==='cpp'){
  if(!cache.clang)cache.clang=Promise.all(['shared.js','clang','lld','memfs','sysroot.tar'].map(name=>get('./vendor/clang/'+name,name!=='shared.js'))).then(([shared,clang,lld,memfs,sysroot])=>({shared,clang,lld,memfs,'sysroot.tar':sysroot})).catch(e=>{delete cache.clang;throw e;});
  return cache.clang;
 }
 if(!cache[language])cache[language]=(language==='typescript'?get('./vendor/typescript/typescript.js').then(typescript=>({typescript})):Promise.all([get('./vendor/pyodide/loader-classic.js'),get('./vendor/pyodide/module-classic.js'),get('./vendor/pyodide/pyodide.asm.wasm',true),get('./vendor/pyodide/python_stdlib.zip',true),get('./vendor/pyodide/pyodide-lock.json')]).then(([loader,module,wasm,stdlib,lock])=>({loader,module,wasm,stdlib,lock:JSON.parse(lock)}))).catch(e=>{delete cache[language];throw e;});
 return cache[language];
}
