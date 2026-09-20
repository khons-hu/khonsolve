// The compiler and the program live in a disposable, network-isolated worker.
function clangWorkerMain(){
 onmessage=async({data:{code,language,resources:r}})=>{
  let output='',executing=false;
  const write=s=>{output+=s;if(output.length>16000)throw Error('Output limit reached (16 KB).');};
  try{
   const Compiler=new Function(r.shared+';return API;')();
   const api=new Compiler({readBuffer:async name=>r[name],compileStreaming:async name=>WebAssembly.compile(r[name]),hostWrite:write});
   api.hostLog=()=>{};
   await api.ready;
   api.memfs.addFile('main',new TextEncoder().encode(code));
   const compiler=await api.getModule('clang');
   await api.run(compiler,'clang','-cc1','-emit-obj',...api.clangCommonArgs,'-std='+ (language==='c'?'c11':'c++17'),'-O0','-o','main.o','-x',language==='c'?'c':'c++','main');
   await api.link('main.o','main.wasm');
   const program=await WebAssembly.compile(api.memfs.getFileContents('main.wasm'));
   output='';executing=true;postMessage({type:'executing'});
   await api.run(program,'main.wasm');
   postMessage({type:'program',output:output.trim()||'(Program finished without output.)'});
  }catch(e){postMessage({type:'error',message:((executing?'Program error: ':'Compilation error: ')+output+'\n'+e.message).replace(/\x1b\[[0-9;]*m/g,'').slice(0,16000)});}
 };
}
