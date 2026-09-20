import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {locales,resolveLocale,preferredLocale,setLocale,getLocale,t,number} from '../i18n.mjs';
import {messages} from '../messages.mjs';
import {exerciseMessages} from '../exercise-messages.mjs';
import {exercises} from '../content.mjs';
test('locale selection honors saved preference, browser regional tags, and English fallback',()=>{
 assert.equal(resolveLocale('SK-sk'),'sk');assert.equal(resolveLocale('xx'),null);
 assert.equal(preferredLocale({getItem:()=> 'hu'},['de-DE']),'hu');
 assert.equal(preferredLocale({getItem:()=> 'invalid'},['fr-FR','cs-CZ']),'cs');
 assert.equal(preferredLocale({getItem(){throw Error('blocked')}},['xx']),'en');
 assert.equal(preferredLocale(undefined,['pl-PL']),'pl');
});
test('all interface translations preserve placeholders and cover bound HTML',()=>{
 const keys=Object.keys(messages.en).sort();
 for(const lang of Object.keys(locales)){
  assert.deepEqual(Object.keys(messages[lang]).sort(),keys);
  for(const key of keys){assert.ok(messages[lang][key].trim());assert.deepEqual([...messages[lang][key].matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(),[...key.matchAll(/\{\w+\}/g)].map(m=>m[0]).sort(),`${lang}: ${key}`);}
 }
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
 for(const [,raw] of html.matchAll(/data-i18n(?:-placeholder|-aria-label|-title)?="([^"]+)"/g)){const key=raw.replaceAll('&amp;','&').replaceAll('&#x27;',"'").replaceAll('&quot;','"');assert.ok(Object.hasOwn(messages.en,key),key);}
});
test('translation fallback, interpolation and locale number formatting',()=>{
 setLocale('de');assert.equal(getLocale(),'de');assert.equal(number(1234.5),'1.234,5');
 assert.equal(t('not present'),'not present');assert.equal(t(0),'0');assert.equal(t('constructor'),'constructor');assert.equal(t('Backup',{},'unknown'),'Backup');
 assert.equal(t('{count} exercises',{count:'15'},'sk'),'Cvičenia: 15');setLocale('en');
});
test('every exercise has translated titles, briefs and three hints without overriding runnable content',()=>{
 for(const lang of Object.keys(locales).filter(l=>l!=='en'))for(const exercise of exercises){const copy=exerciseMessages[lang][exercise.id];assert.ok(copy.title&&copy.brief);assert.equal(copy.hints.length,3);assert.ok(copy.hints.every(Boolean));assert.deepEqual(Object.keys(copy).sort(),['brief','hints','title']);const merged={...exercise,...copy};assert.equal(merged.starter,exercise.starter);assert.equal(merged.reference,exercise.reference);assert.equal(merged.tests,exercise.tests);}
});
