# Interface languages

English, Slovak, Hungarian, Polish, German, Spanish and Czech are available through the native-name selector. A saved choice takes precedence over supported browser language preferences. Unsupported languages fall back to English. Locale storage is separate from exercise backups.

`messages.mjs` contains interface messages. `i18n.mjs` resolves preferences, formats numbers through Intl and binds explicitly marked static elements. Dynamic render paths call the same translator. No translation service, dependency or automatic DOM observer is used.

`exercise-messages.mjs` translates all 15 exercise titles, briefs and 45 hints. Constraints, examples, concepts, full solutions and review checklists remain authored English and the interface explicitly states this limitation. Code, user answers and test fixtures are never translated. Runtime/compiler diagnostics may remain English. Finished results keep the language used when they ran, and switching interface language preserves results, active runs and the open reference solution.

Verification: `npm test` checks dictionary coverage, placeholders, regional browser preferences, blocked storage, fallback, number formatting and exercise translation coverage, alongside the original execution and persistence tests. Browser checks covered all seven locales, 15 rendered cards, saved preference after reload, draft/code preservation, translated hints and the backup dialog.
