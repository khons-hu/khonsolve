# QA — 20 September 2026

## Verified
- Ten Node tests: content completeness, reference solutions, input preservation, backup validation/round trip, combined filters, runner success/failure, syntax errors and termination.
- Desktop light theme and mobile dark theme visually inspected.
- Browser JavaScript runner passed all five cases for the first exercise.
- Infinite-loop submission stopped after two seconds; the interface remained usable.
- Browser runner reports `typeof localStorage` as undefined. A fetch to the local app origin is blocked by CSP.
- Notes, hint count, review state and reflection survive reload.
- Prompt-track filtering returns three exercises and hides the code editor for written exercises.
- A responsive grid issue found at 390px was fixed and visually rechecked.
- Exported notebook downloaded successfully through the browser's Save dialog.

## Limits
- Import schema and data round-trip are covered by tests; native file-import interaction still needs a complete end-to-end check.
- No claims of exhaustive accessibility conformance or all-browser compatibility.
- Runner sample checks do not prove correctness, complexity or resistance to deliberate self-tampering. Browsers control memory limits.

## Language expansion
- TypeScript and Python correct solutions passed all five first-exercise cases in the browser.
- Independent Go and Python drafts survive language switching and reload.
- Go/C/C++ explicitly use external runners; the app does not claim to compile or grade them.
- Python infinite-loop submission was terminated after two seconds in browser QA.
- C++ editor and external runner controls visually checked at 390px.

## Local C / C++ compiler (2026-09-20)
- Browser: C printf produced 42; C++17 std::optional + iostream produced 42.
- Invalid C displayed source diagnostics, and the next run worked.
- Infinite C loop terminated after the 2-second program limit.
- Compiler stays inside the existing opaque-origin sandbox worker. Assets downloaded from this site only on Run. No network isolation relaxation.
- Explicit experimental Clang 8 label and approximately 60 MB first-load notice. Full-program output is not an automatic exercise pass.
- Go remains an external-playground workflow. Investigated browser Go toolchains are old/limited; official Go Playground integration requires contacting its operators. No hidden remote execution added.
