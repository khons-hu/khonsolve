import {messages} from './messages.mjs';
export const locales={en:'English',sk:'Slovenčina',hu:'Magyar',pl:'Polski',de:'Deutsch',es:'Español',cs:'Čeština'};
const storageKey='khonsolve-ui-language';
export function resolveLocale(value){const base=String(value||'').toLowerCase().split(/[-_]/)[0];return Object.hasOwn(locales,base)?base:null;}
export function preferredLocale(storage, browserLanguages=[]){try{const saved=resolveLocale(storage?.getItem(storageKey));if(saved)return saved;}catch{}return browserLanguages.map(resolveLocale).find(Boolean)||'en';}
let storage;try{storage=globalThis.localStorage;}catch{}
let locale=preferredLocale(storage,globalThis.navigator?.languages||[globalThis.navigator?.language]);
export const getLocale=()=>locale;
export function setLocale(value){locale=resolveLocale(value)||'en';try{globalThis.localStorage?.setItem(storageKey,locale);}catch{}return locale;}
export function t(key,params={},language=locale){const localized=Object.hasOwn(messages,language)?messages[language]:messages.en;const template=Object.hasOwn(localized,key)?localized[key]:Object.hasOwn(messages.en,key)?messages.en[key]:String(key);return template.replace(/\{(\w+)\}/g,(match,name)=>Object.hasOwn(params,name)?String(params[name]):match);}
export const number=value=>new Intl.NumberFormat(locale).format(value);
export function applyLocale(root=document){root.documentElement.lang=locale;root.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.dataset.i18n);});for(const attr of ['placeholder','aria-label','title'])root.querySelectorAll(`[data-i18n-${attr}]`).forEach(el=>el.setAttribute(attr,t(el.getAttribute(`data-i18n-${attr}`))));}
