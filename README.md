# Thinkroom

A free practice workshop for coding, debugging, logic, prompts and agent skills. Write an approach, try it, reveal hints when needed, then reflect.

## What's here

- 15 original exercises across five tracks.
- Five JavaScript exercises with sample checks in a disposable browser worker.
- Written exercises with incremental hints, explanations and explicit self-review rubrics.
- Saved drafts, a revisit list, light/dark themes and JSON backup/import.
- No account, backend, telemetry, runtime dependencies or paid AI calls.

## Run locally

Requires Node.js 20+ for the development server and tests. The deployed app runs in modern browsers.

```sh
npm start
# http://127.0.0.1:4174
npm test
```

No npm install is needed. Deploy on Vercel with Framework Preset **Other**, no build command and output directory `.`.

## What the checks mean

Passing the visible cases is not a proof of correctness or a complexity assessment. Written exercises are self-reviewed. Reference answers are teaching examples, not the only valid solution. This is a curated starting collection, not a continuously updated or universally best curriculum.

The JavaScript runner executes in a Worker inside a sandboxed iframe without `allow-same-origin`. CSP blocks network access, and the worker is terminated after two seconds. There is no server-side execution. It is a personal learning runner, not a secure competition judge: a determined user can inspect answers or tamper with their own results. Memory limits depend on the browser. Do not paste secrets or run code you do not understand.

Progress stays in this browser's local storage. Clearing site data or using another device does not preserve it. Export a backup. Import validates the schema, caps file/field sizes, ignores unknown exercise IDs and merges known exercises after explicit confirmation.

## Content and sources

All exercise wording, examples and explanations are authored for this project. External links are for further study. No affiliation with LeetCode, HackerRank or model providers.

Sources checked September 2026:
- [LeetCode Top Interview 150](https://leetcode.com/studyplan/top-interview-150/)
- [HackerRank preparation kits](https://www.hackerrank.com/interview/preparation-kits)
- [Prompt engineering guidance](https://developers.openai.com/api/docs/guides/prompt-engineering)
- [Agent Skills specification](https://agentskills.io/specification)
- [MDN Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## Contributing

Exercises live in `content.mjs`. Include a learning objective, three hints, a worked explanation and three observable review criteria. Runnable exercises also need starter code, deterministic tests and a reference implementation. Run `npm test` and check keyboard/mobile behaviour before proposing changes.

Built by [khonsu](https://khons-hu.vercel.app/) with coding-agent assistance.
