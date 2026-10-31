# Signature and parent journey

Implementation of the approved 31 October 2026 parent walkthrough and typography comparison. Deployment is verified separately against the release commit; automated checks do not establish human family/native-language acceptance.

## Identity

The approved Trazolino signature is the primary mark on home, catalogue, preparation, lesson, About and the licence-review page. Its SVG preserves the original native tldraw ink paths; only the proof background and artboard margins changed. The compact T is reserved for favicons and the optional signature-to-monogram animation, not general headers.

Browser icons use the approved T with pencil yellow `#F3C33D`, eraser border `#D99282`, and graphite `#292723`. The SVG favicon, 32px PNG fallback and 180px touch icon share the geometry. The 16/32/48px optical review retained the exact T.

`src/signature` contains the approved twelve pressure-aware gestures and motion score. The optional home player loads the real read-only tldraw renderer on request, uses the existing licence configuration, respects reduced motion, and offers pause, still view and replay. It never gates activity selection or loops. The static signature is immediate, and a failed optional animation falls back to it. No-key production builds still exclude lesson/SDK JavaScript.

## Typography

The approved comparison retains Nunito with 700-weight headings, collection/drawing titles and primary controls. Regular body text and existing sizes/spacing remain. The signature carries the handwritten identity; rounded UI letterforms connect it to the pencil illustrations without the previous 900-weight competition. About follows the same hierarchy. The unused 900-weight font asset is no longer loaded.

## Family controls and clocks

- **Pause** is an unlimited inline hold. The current demonstration remains visible, narration and music stop, and automatic progression stops. Visible, active family drawing time continues; the current stage estimate does not.
- **Resume this step** continues that step. The existing audio interruption contract restarts an unfinished spoken instruction from its beginning; the drawing retains its exact partial progress. **Next step** deliberately advances, and **Replay this step** restarts the current step. Optional detail/finish labels retain their authored meaning.
- **More time** is a secondary label on Pause because prepared hints still use that name. There is one hold action. Narration scripts and recordings have not changed.
- **Help** opens a nonmodal panel beside the desktop board or below the phone board. It holds the step until an explicit Resume/Next/Replay action. Hints play only on request; the full transcript and adult suggestions are expandable. Escape/close return keyboard focus to Help.
- **At our pace** is optional in preparation and drawing settings. Demonstrations still play normally; automatic next-step dispatch is disabled. Automatic pacing remains the default pending family observation. Preferences remain in application memory.
- Hidden tabs, board errors, playback interruptions and unexpected stalls retain immediate silence, no catch-up and explicit adult resumption. The initial declaration remains mandatory. It is a declaration, not verified consent or identity.
- **Keep drawing** returns directly to the visible held picture only during continuous supervision. Backgrounding or an interruption revokes that continuity, including while the finish dialog is open. Another drawing and Finish session lead the completion actions.

## Entry and layout

The home language control is a real stable chooser. The current choice applies to the home copy and following collections; it is retained during navigation inside the app, without new storage. The former moving language strip is no longer shown. Existing three collection levels gain short skill descriptions; the cat is marked as a suggested first drawing. Available cards show approximate narrated duration in the selected locale; open exploration and pauses remain outside that estimate. Pagination remains explicit. Practical parent guidance is separate from privacy, and reachable from the catalogue footer on phones.

The 320px phone board has a 235px minimum surface height. Controls wrap and the page scrolls rather than compressing the drawing indefinitely. Body copy and controls retain the existing readable typeface; handwriting is reserved for the identity.

## Validation and review boundaries

Run `npm run check`. Regression coverage includes independent together/stage clocks, hidden/stale clock events, continuous versus interrupted Keep drawing, and the reviewable UI copy in every translated locale. Source-linked regional dictionaries remain aligned; new wording is assistant-authored and still needs native/fluent review. No paid media or new voices were generated.

The local browser walkthrough covers English/Spanish entry, language retention, optional native animation, pause/silence/visible reference, inline Help, finish/continue, and desktop/390px/320px layouts. Development tldraw displays its normal licence notice. This is not full audio mastering, physical-device, screen-reader or reduced-motion OS certification. Family comprehension testing remains separate. Production verification follows the exact merged commit through the protected release workflow.
