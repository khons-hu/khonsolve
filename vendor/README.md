# Browser runtime provenance

- TypeScript **6.0.3**, npm `typescript@6.0.3`: `lib/typescript.js`, LICENSE.txt and ThirdPartyNoticeText.txt. Browser-compatible JavaScript compiler API. It transpiles TypeScript syntax, without semantic type checking. This is deliberately not the native TypeScript 7 package.
- Pyodide **314.0.7**, npm `pyodide@314.0.7`: loader, Emscripten module, WASM, stdlib and package lock. MPL-2.0 license from the matching upstream tag is included. Original `.mjs` source is retained. The CPython license is included as PYTHON-LICENSE.txt.

## Pyodide adaptation

The sandbox uses opaque-origin classic workers. To avoid module-worker loading restrictions, `.mjs` modules were converted to IIFEs with esbuild, retaining the originals:

```
esbuild pyodide.mjs --format=iife --global-name=PyLoader --define:import.meta.url='"https://unused.invalid/pyodide.mjs"' --outfile=loader-classic.js
esbuild pyodide.asm.mjs --format=iife --global-name=PyModule --define:import.meta.url='"https://unused.invalid/pyodide.asm.mjs"' --outfile=module-classic.js
```

`loader-classic.js` has one adaptation: `getInstantiateWasmFunc` (`Ie`) takes an optional `wasmBinary` ArrayBuffer from configuration. It uses that buffer rather than fetching the WASM URL, preserving Pyodide's exception helper imports and initialization logic. Source changes are visible in Git. This permits the parent to fetch static assets and send buffers to a worker that cannot make HTTP requests. The stdlib is passed using an in-memory blob URL. The unused.invalid URL is a non-fetching base placeholder, not a runtime service.

Do not change this to a same-origin unsandboxed runner. Test correct results, syntax/runtime errors and infinite-loop termination after runtime updates.
