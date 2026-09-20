# QA — 20 September 2026

## Verified
- Seven Node tests: content completeness, reference solutions, input preservation, backup validation/round trip, combined filters, runner success/failure, syntax errors and termination.
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
