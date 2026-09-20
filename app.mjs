import {tracks,exercises} from './content.mjs';
import {blank,newAttempt,validate,filtered} from './core.mjs';
const $=id=>document.getElementById(id),ids=exercises.map(e=>e.id),key='thinkroom-v1';
let state=blank(),track='all',query='',queue=false,runId=0,runnerReady=false,runTimer,activeRun=null,pendingImport;
try{const saved=localStorage.getItem(key);if(saved)state=validate(JSON.parse(saved),ids);}catch{$('save-state').textContent='Saved data could not be loaded. Export or keep a backup.';}
const current=()=>exercises.find(e=>e.id===state.selected)||exercises[0];
const attempt=()=>state.attempts[state.selected]??=(newAttempt());
function save(){try{localStorage.setItem(key,JSON.stringify(state));$('save-state').textContent='Saved on this device';}catch{$('save-state').textContent='Browser storage is unavailable or full. Export a backup.';}}
function text(id,value){$(id).textContent=value;}
function button(label,handler,className=''){const b=document.createElement('button');b.textContent=label;b.className=className;b.addEventListener('click',handler);return b;}
function renderLibrary(){
 $('tracks').replaceChildren(...tracks.map(t=>{const b=button(`${t.icon}  ${t.name}`,()=>{track=t.id;renderLibrary();});b.setAttribute('aria-pressed',String(track===t.id));return b;}));
 const matches=filtered(exercises,track,query,state,queue);text('result-count',`${matches.length} exercises`);text('progress',`${Object.values(state.attempts).filter(a=>a.done).length} reviewed`);text('queue-count',Object.values(state.attempts).filter(a=>a.revisit).length);
 $('queue').setAttribute('aria-pressed',String(queue));
 const cards=matches.map(e=>{const b=button('',()=>select(e.id));b.className='exercise-card';b.setAttribute('aria-current',String(state.selected===e.id));const tag=document.createElement('span');tag.className='card-tag';tag.textContent=`${e.level} · ${e.minutes} min${state.attempts[e.id]?.done?' · Reviewed ✓':''}`;const title=document.createElement('strong');title.textContent=e.title;const sub=document.createElement('span');sub.className='card-concept';sub.textContent=e.concept;b.append(tag,title,sub);return b;});
 if(!cards.length){const p=document.createElement('p');p.className='empty';p.textContent=queue?'Nothing here yet. Save an exercise for another round.':'No matches. Try a different word or track.';cards.push(p);}
 $('exercise-list').replaceChildren(...cards);
}
function select(id){if(!ids.includes(id))return;state.selected=id;save();render();$('workspace').focus({preventScroll:true});if(matchMedia('(max-width: 850px)').matches)$('workspace').scrollIntoView({behavior:'instant'});}
function renderHints(){const a=attempt(),e=current();$('hints').replaceChildren(...e.hints.slice(0,a.hints).map(h=>{const li=document.createElement('li');li.textContent=h;return li;}));text('hint-count',`${a.hints}/3`);$('hint').disabled=a.hints>=e.hints.length;}
function renderReview(){const a=attempt(),e=current();$('review-panel').hidden=!a.review;$('review-toggle').setAttribute('aria-expanded',String(a.review));text('solution',e.solution);$('reference').hidden=!e.reference; $('reference').open=false;text('reference-code',e.reference||'');$('rubric').replaceChildren(...e.rubric.map((r,i)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.checked=a.checks.includes(i);input.addEventListener('change',()=>{a.checks=input.checked?[...new Set([...a.checks,i])]:a.checks.filter(n=>n!==i);save();});const span=document.createElement('span');span.textContent=r;label.append(input,span);return label;}));$('reflection').value=a.reflection;text('complete',a.done?'Reviewed ✓ · Undo':'Mark reviewed ✓');}
function render(){
 const e=current(),a=attempt();text('exercise-category',tracks.find(t=>t.id===e.track).name);text('exercise-number',String(ids.indexOf(e.id)+1).padStart(2,'0'));text('title',e.title);text('difficulty',e.level);text('time',`${e.minutes} min`);text('concept',e.concept);text('brief',e.brief);text('example',e.example);text('constraints',e.constraint);
 $('source').hidden=!e.source;if(e.source){$('source').href=e.source.url;text('source',`Explore further: ${e.source.label} ↗`);}else $('source').removeAttribute('href');
 $('notes').value=a.notes;$('code-section').hidden=!e.starter;$('code').value=a.code??e.starter??'';text('test-results','');text('revisit',a.revisit?'↺ Saved for later':'↺ Save for later');$('revisit').setAttribute('aria-pressed',String(a.revisit));
 renderHints();renderReview();renderLibrary();document.documentElement.dataset.theme=state.theme;$('theme').setAttribute('aria-label',state.theme==='dark'?'Switch to light theme':'Switch to dark theme');
 $('run').disabled=!!activeRun||!runnerReady;
}
$('search').addEventListener('input',e=>{query=e.target.value;renderLibrary();});$('queue').addEventListener('click',()=>{queue=!queue;renderLibrary();});
$('pick').addEventListener('click',()=>{const pool=exercises.filter(e=>!state.attempts[e.id]?.done);const candidates=pool.length?pool:exercises;select(candidates[Math.floor(Math.random()*candidates.length)].id);$('workspace').scrollIntoView({behavior:'instant'});});
for(const field of ['notes','code','reflection'])$(field).addEventListener('input',()=>{attempt()[field]=$(field).value;save();});

$('hint').addEventListener('click',()=>{attempt().hints=Math.min(3,attempt().hints+1);save();renderHints();});
$('review-toggle').addEventListener('click',()=>{attempt().review=!attempt().review;save();renderReview();});
$('complete').addEventListener('click',()=>{const a=attempt();if(!a.done&&!a.reflection.trim()){text('save-state','Write a short reflection before marking this reviewed.');$('reflection').focus();return;}a.done=!a.done;save();renderReview();renderLibrary();});
$('revisit').addEventListener('click',()=>{attempt().revisit=!attempt().revisit;save();text('revisit',attempt().revisit?'↺ Saved for later':'↺ Save for later');$('revisit').setAttribute('aria-pressed',String(attempt().revisit));renderLibrary();});
$('theme').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=state.theme;$('theme').setAttribute('aria-label',state.theme==='dark'?'Switch to light theme':'Switch to dark theme');save();});
$('reset-code').addEventListener('click',()=>{if(!confirm('Replace this exercise’s code with the starter? Your notes stay.'))return;attempt().code=current().starter;$('code').value=attempt().code;save();text('test-results','');});
function finishRun(){clearTimeout(runTimer);activeRun=null;$('run').disabled=!runnerReady;}
$('run').addEventListener('click',()=>{
 const e=current();if(!e.tests||!runnerReady||activeRun)return;const id=++runId;activeRun={runId:id,exercise:e.id};$('run').disabled=true;text('test-results','Running. The rubber duck is watching.');
 runTimer=setTimeout(()=>{const stillHere=activeRun?.exercise===state.selected;finishRun();if(stillHere)text('test-results','Runner did not respond. Reload the page and try again.');},4500);
 $('runner').contentWindow.postMessage({type:'run',runId:id,code:$('code').value,tests:e.tests.map(t=>({...t,immutable:e.id==='merge'}))},'*');
});
addEventListener('message',event=>{
 if(event.source!==$('runner').contentWindow)return;const data=event.data;
 if(data?.type==='runner-ready'){runnerReady=true;$('run').disabled=!!activeRun;return;}
 if(!activeRun||data?.runId!==activeRun.runId)return;const visible=activeRun.exercise===state.selected;finishRun();if(!visible)return;
 if(data.type==='error'){text('test-results',String(data.message).slice(0,500));return;}
 if(data.type!=='result'||!Array.isArray(data.results)){text('test-results','Unexpected runner response.');return;}
 const passed=data.results.filter(r=>r.pass===true).length;const summary=document.createElement('p');summary.className='test-summary';summary.textContent=passed===data.results.length?`${passed}/${data.results.length} checks passed. Now try to break it yourself.`:`${passed}/${data.results.length} checks passed. A useful clue, not a verdict.`;
 $('test-results').replaceChildren(summary,...data.results.slice(0,20).map((r,i)=>{const row=document.createElement('div');row.className=r.pass?'test-pass':'test-fail';row.textContent=`${r.pass?'✓':'×'} Check ${i+1}: expected ${String(r.expected).slice(0,500)} · got ${String(r.actual).slice(0,500)}${r.note?' · '+String(r.note).slice(0,200):''}`;return row;}));
});
for(const [trigger,dialog] of [['backup','backup-dialog'],['about','about-dialog']])$(trigger).addEventListener('click',()=>$(dialog).showModal());
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=`thinkroom-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
$('import-file').addEventListener('change',async()=>{pendingImport=null;$('import-confirm').disabled=true;const file=$('import-file').files[0];if(!file)return;if(file.size>2000000){text('import-status','This file is too large. Maximum: 2 MB.');return;}try{pendingImport=validate(JSON.parse(await file.text()),ids);text('import-status',`${Object.keys(pendingImport.attempts).length} saved exercises ready to import.`);$('import-confirm').disabled=false;}catch(error){text('import-status',`Could not read backup: ${error.message}`);}});
$('import-confirm').addEventListener('click',()=>{if(!pendingImport)return;state.attempts={...state.attempts,...pendingImport.attempts};pendingImport=null;$('import-confirm').disabled=true;save();render();text('import-status','Imported. Your notebook is ready.');});
render();

$('runner').addEventListener('load',()=>$('runner').contentWindow.postMessage({type:'ping'},'*'));
$('runner').contentWindow.postMessage({type:'ping'},'*');
