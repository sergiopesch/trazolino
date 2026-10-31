# Multilingual interface audit — 31 October 2026

Preserve the approved Nunito typography, pencil palette, signature and paper-first lesson. This is an assistant interface/editorial audit, not native-language approval or full perceptual listening.

## Scope and findings

Seven written locales: British English, Latin American Spanish, Spain Spanish, French, German, Italian and Dutch. Irish and Scottish English share written English and retain separate voice identities; all nine selectable options are exercised.

1. **Home and language selection — refined.** Localize the document title as soon as a language is selected. Translate complete level invitations instead of joining a verb and a level name, which produced awkward phrases such as “Entdecken Anfänger”. Shared desktop/tablet card rows keep action buttons aligned when translations wrap. On phones the family note occupies a separate footer row, preventing cramped Privacy/About labels and isolated short words.
2. **How it works, For grown-ups and Privacy — verified and refined.** Keep explanatory copy and labels localized. Give the standalone legal/audio-credit links 44px-high targets. Their canonical third-party/legal documents retain their original wording.
3. **Signature — verified.** Preserve the native tldraw drawing and reduced-motion behavior, localized controls and hobby-licence thank-you. Longer German and Dutch controls may wrap to a second row rather than truncate.
4. **Catalogues — verified.** Existing browser coverage visits all three pages of all three levels for each voice/language option: 30 drawing choices per option. Check labels, counts, navigation, voice samples and parent setup.
5. **Setup, drawing, Help and settings — verified.** The representative Cat journey exercises adult acknowledgement, sound opt-outs, visible paused drawing, expanded Help, both settings tabs and finish. Existing accessibility checks cover 320×256 reflow, landscape, keyboard access, focus and automated accessibility scanning. This is not a visual inspection of every stage of every lesson.
6. **Completion — verified.** Localized controls fit and return to the home screen in the selected language.
7. **About — fixed.** The footer link and complete founder story now use the selected written language. About and its return links carry a validated `lang` URL preference, including the English voice variants. Unknown values fall back to English. No account, storage or child information is introduced. English remains readable without JavaScript; a small local module translates the page when JavaScript is available. The About module does not import the locale/lesson registry, so no-key review builds continue to exclude lessons and the SDK.

## Reproducible evidence

- `tests/browser/multilingual-ui.spec.js`: 14 shared states per option at 1280, 390 and 320 CSS-pixel widths; text containment, reachable targets, no horizontal overflow, localized metadata, About reload/return, completion and silence. Captures desktop/mobile images for each state. Also checks unknown URL values.
- `tests/browser/catalogues.spec.js`: all catalogue levels/pages and actual voice samples for all nine options.
- `tests/browser/accessibility.spec.js`: all-locale lesson/setup/Help/settings plus keyboard-only entry and information dialogs.
- `tests/browser/about.spec.js`: keyboard navigation, reflow, portrait and no-JavaScript fallback.
- `tests/about-copy.test.mjs`: complete written-locale coverage and exact-copy review fingerprint. Existing source-linked UI dictionary tests retain their regional provenance and media identities.
- `npm run check` and the configured browser matrix remain release gates. Browser artifacts are retained by CI; the local report is `output/playwright/report/index.html`, with full state captures in `output/playwright/results/`.

Fresh computer-use observations, before/after captures, locale overview sheets, full-resolution captures and run logs are retained locally at `/home/sergiopesch/Documents/ChatGPT/DrawingTeacher/design/language-ui-audit-2026-10-31/`. Overview sheets are indexes of captured screens; full-size originals are the detailed evidence.

## Remaining review boundary

No new locale, narration, lesson caption, recorded instruction, voice identity or music was changed. New UI/About wording is assistant-authored and awaits native/fluent human review. Browser emulation and automated checks do not certify every physical phone, screen reader, lesson stage or audio mix. The next human check is a short per-language family walkthrough, recorded against the exact release.
