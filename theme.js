// Apply before styles load. Explicit saved choices take precedence.
(()=>{let saved;try{saved=JSON.parse(localStorage.getItem('thinkroom-v1')||'{}').theme;}catch{}
const theme=saved==='light'||saved==='dark'?saved:(globalThis.matchMedia?.('(prefers-color-scheme: light)').matches?'light':'dark');
document.documentElement.dataset.theme=theme;})();
