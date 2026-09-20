let worker,timer,url;
function cleanup(){clearTimeout(timer);worker?.terminate();worker=null;if(url)URL.revokeObjectURL(url);url=null;}
addEventListener('message',event=>{
 if(event.source!==parent)return;
 if(event.data?.type==='cancel'){cleanup();return;}
 if(event.data?.type==='ping'){parent.postMessage({type:'runner-ready'},'*');return;}
 if(event.data?.type!=='run')return;
 cleanup();const {code,tests,runId,language,resources}=event.data;
 if(typeof code!=='string'||code.length>20000||!Array.isArray(tests)||tests.length>20)return;
 const reply=data=>parent.postMessage({...data,runId},'*');
 try{
  url=URL.createObjectURL(new Blob(['('+(language==='c'||language==='cpp'?clangWorkerMain:language==='python'?pythonWorkerMain:workerMain).toString()+')();'],{type:'text/javascript'}));worker=new Worker(url);
  timer=setTimeout(()=>{cleanup();reply({type:'error',message:'Runtime initialization timed out. Try again.'});},language==='c'||language==='cpp'?30000:language==='python'?30000:language==='typescript'?10000:2000);
  worker.onmessage=e=>{const data=e.data;if(data?.type==='executing'){clearTimeout(timer);timer=setTimeout(()=>{cleanup();reply({type:'error',message:'Stopped after 2 seconds. Check for an infinite loop or a slow algorithm.'});},2000);reply(data);return;}cleanup();if(data?.type==='program'||data?.type==='result'&&Array.isArray(data.results))reply(data);else reply({type:'error',message:String(data?.message||'Runner error')});};
  worker.onerror=event=>{cleanup();reply({type:'error',message:String(event.message||'The runner could not execute this code.').slice(0,500)});};
  worker.postMessage({code,tests,language,resources});
 }catch(error){cleanup();reply({type:'error',message:String(error.message)});}
});
parent.postMessage({type:'runner-ready'},'*');
