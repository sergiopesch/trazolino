# Full-app testing

Use this process when asked to test the entire app, all lessons, or all languages. It is an audit standard, not a claim that every check is currently automated. For a narrower request, report the narrower scope instead. Copy [the report template](full-app-test-report-template.md) into an ignored output directory or other agreed evidence location; keep reports and traces out of Git.

## 1. Identify the target and inventory

- Record the date, tester, target URL or environment, checkout revision and dirty state, deployed revision where applicable, browser/device configurations, and applicable licence state. Never record licence keys or credentials. If source and deployed revisions differ, obtain the matching source or report the mismatch and do not claim source-to-deployment coverage.
- Derive the list of selectable locale/voice options and released lessons from the target revision's locale registry and lesson catalogue, including per-locale availability. Record the expected combinations and stage counts; distinguish deliberately unavailable lessons from missing or failing released lessons. Recompute this inventory on each audit rather than relying on an old count.
- Record test conditions and tooling. Tests must not generate paid media or bypass the supervision gate, tldraw licence enforcement, or deployment protection. Limit concurrency and request rate for a public site.

## 2. Run the established checks

- Run `npm run check` on the matching source. Run `npm run test:browser` for local browser coverage when practical; see its configuration for projects and server requirements.
- For production, run the revision-bound `npm run verify:production -- --url https://trazolino.org --commit <full-40-character-deployed-commit>` and retain its report. Follow [deployment verification](deployment.md#repeatable-production-verification) for prerequisites, target identity and interpretation. A failed, skipped or unavailable check remains visible in the report.
- Run `npm run review:localization` to produce the current review packets. Follow [localization guidance](localization/README.md) for source, recording identity and human-review evidence. Packet generation is not a review.

## 3. Exercise the lesson matrix

For every released locale/voice and lesson combination, start from the actual interface and record one final result with lesson ID, locale, expected and observed stage counts, failures and evidence. Include every stage, including optional stages. At minimum:

1. Select the locale and lesson; verify the localized catalogue title and that the supervision gate requires acknowledgement. Start the lesson using the intended controls.
2. Confirm the real teaching board renders visible drawing marks and remains available beyond the licence-validation period. At each stage, verify the expected localized title and instruction, the board's presence, and startup of the corresponding instruction recording. Watch for relevant page errors, failed site requests and unavailable/licence states.
3. Exercise Help and its localized text and narration, then progress through the complete sequence and reach the finish state. Record which hints were checked. Test pause, resume, replay, more time and exit in representative flows, and expand coverage when the change affects those controls.
4. Record whether each instruction and drawing was observed for its full duration or only briefly, and whether progress was automatic or manually advanced. If the board's initial marks alone were checked, say so; board presence does not prove every stage's drawing is correct.

The repository does **not** currently provide a maintained command for this exhaustive matrix. Use a suitable documented manual procedure or build a bounded audit harness for the run; preserve its method and evidence. The regular browser and production suites must not be presented as completing this matrix. If a harness is interrupted, mark work that did not finish as incomplete; preserve attempts, distinguish infrastructure interruptions from product failures, and rerun affected combinations. A pass requires a completed passing result for every expected released combination against the same target revision. Report missing, skipped, failed and unavailable combinations separately.

## 4. Media, accessibility and human acceptance

Use the build's narration metadata and asset checks for the matching source. Where a comprehensive media integrity audit is requested, decode each unique referenced recording completely with a suitable decoder, record its version, inventory, failures and completion status, and report missing tooling as incomplete. Source asset decoding does not prove the public site serves the same bytes or that audio sounds good.

Record browser engines and viewport/device coverage separately from the lesson matrix. Exercise keyboard and screen-reader flows, real touch devices and actual audio playback when available, and say what was not tested. Technical playback and decoding do not establish translation quality, pronunciation, timing, educational quality, family acceptance or accessibility on real devices. Record native/fluent language review, full human listening, educator/family review and physical-device testing only when people actually perform them, using the [acceptance checklist](localization/acceptance-checklist.md). Do not collect identifying child data.

## 5. Report and follow up

Use the template to give expected, passed, failed, incomplete and intentionally unavailable counts, link evidence, and describe exact coverage and limitations. A comprehensive audit is complete only when every required check has a recorded result, all expected released combinations pass, production identity remains stable throughout any live run, and required human reviews have actually been completed. If any requirement is missing, label the audit incomplete or failed as appropriate and identify the next action. Distinguish an automated pass from human acceptance; never promise the app is 100% defect-free.

Do not deploy, alter licences or change product behavior merely to make an audit pass. Investigate failures and follow the project's normal change and release process. Update this guide when the audit tooling or coverage changes.
