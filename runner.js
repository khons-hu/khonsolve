let worker,timer,url;
function cleanup(){clearTimeout(timer);worker?.terminate();worker=null;if(url)URL.revokeObjectURL(url);url=null;}
addEventListener('message',event=>{
 if(event.source!==parent)return;
 if(event.data?.type==='ping'){parent.postMessage({type:'runner-ready'},'*');return;}
 if(event.data?.type!=='run')return;
 cleanup();const {code,tests,runId}=event.data;
 if(typeof code!=='string'||code.length>20000||!Array.isArray(tests)||tests.length>20)return;
 const reply=data=>parent.postMessage({...data,runId},'*');
 try{
  url=URL.createObjectURL(new Blob(['('+workerMain.toString()+')();'],{type:'text/javascript'}));worker=new Worker(url);
  timer=setTimeout(()=>{cleanup();reply({type:'error',message:'Stopped after 2 seconds. Check for an infinite loop or a slow algorithm.'});},2000);
  worker.onmessage=e=>{const data=e.data;cleanup();if(data?.type==='result'&&Array.isArray(data.results))reply(data);else reply({type:'error',message:String(data?.message||'Runner error')});};
  worker.onerror=()=>{cleanup();reply({type:'error',message:'The runner could not execute this code.'});};
  worker.postMessage({code,tests});
 }catch(error){cleanup();reply({type:'error',message:String(error.message)});}
});
parent.postMessage({type:'runner-ready'},'*');
