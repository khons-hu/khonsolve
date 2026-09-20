/* Runs only in a disposable Worker inside the opaque-origin runner frame. */
function workerMain(){
 const send=self.postMessage.bind(self),parse=JSON.parse,stringify=JSON.stringify;
 function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==='object'){const out={};for(const key of Object.keys(value).sort())out[key]=canonical(value[key]);return out;}return value;}
 self.onmessage=async event=>{
  const {code,tests}=event.data;
  try{
   const solve=new Function('"use strict";\n'+code+'\n;return typeof solve === "function" ? solve : null;')();
   if(!solve)throw Error('Define a function named solve.');
   const results=[];
   for(const test of tests){
    const args=parse(stringify(test.args));const before=stringify(args);
    try{const actual=await solve(...args);const unchanged=!test.immutable||stringify(args)===before;results.push({pass:unchanged&&stringify(canonical(actual))===stringify(canonical(test.expected)),actual:String(stringify(actual)??actual).slice(0,500),expected:stringify(test.expected),note:unchanged?'':'Input was changed.'});}
    catch(error){results.push({pass:false,actual:String(error?.message||error).slice(0,300),expected:stringify(test.expected),note:'Threw an error'});}
   }
   send({type:'result',results});
  }catch(error){send({type:'error',message:String(error?.message||error).slice(0,300)});}
 };
}
if(typeof module!=='undefined')module.exports={workerMain};
