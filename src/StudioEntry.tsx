import type { LevelId } from "./core/contracts.ts";
import { translate } from "./ui-translations.js";
import { LocaleContext } from "./i18n.jsx";
import { ParentGuide } from "./ParentGuide.tsx";
import { getLanguage } from "./languages.js";
import { useEffect, useState } from "react";
import { Home } from "./Home.jsx";
import { HowItWorks } from "./HowItWorks.jsx";
import { Privacy } from "./Privacy.jsx";
import { LanguagePicker } from "./LanguagePicker.jsx";
import { getLevel } from "./lesson-levels.js";
import { languageAvailableForLevel } from "./languages.js";
import { createLatestLanguageRequest } from "./language-request.js";
import { prepareEntry } from "./entry-loading.js";

export function StudioEntry() {
  const [languageId, setLanguageId] = useState("en-GB");
  const [choosingLanguage, setChoosingLanguage] = useState(false);
  const [entry, setEntry] = useState<Awaited<ReturnType<typeof prepareEntry>> | null>(null);
  const [level, setLevel] = useState<LevelId | null>(null);
  const [overlay, setOverlay] = useState<"privacy" | "how" | "parents" | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [request] = useState(createLatestLanguageRequest);
  useEffect(() => {
    document.querySelector<HTMLHeadingElement>("main h1")?.focus({ preventScroll: true });
    return () => request.cancel();
  }, [request]);

  function closePicker() {
    request.cancel();
    setLevel(null);
    setChoosingLanguage(false);
    setPending(null);
    setError(false);
  }
  function explore(levelId: LevelId) {
    if (!getLevel(levelId)) return;
    closePicker();
    setLevel(levelId);
    void request.run(() => prepareEntry(languageId, levelId), {
      onStart: () => { setPending(languageId); setError(false); },
      onSuccess: next => {
        if (!next.studio.activateInitialSelection(next.selection))
          throw new TypeError("The selected narration could not be verified.");
        setEntry(next);
      },
      onError: () => { setPending(null); setError(true); },
    });
  }
  function selectLanguage(id: string) {
    if (!languageAvailableForLevel(id, "basic")) return;
    setLanguageId(id);
    document.documentElement.lang = id;
    closePicker();
  }

  const pickerLevel = getLevel(level);
  const language = getLanguage(languageId);
  if (!language) throw new TypeError("Unknown language");
  if (entry) {
    const { App } = entry.studio;
    return <App initialSelection={entry.selection} />;
  }
  return <LocaleContext.Provider value={languageId}>
    <Home onExplore={explore} language={language} onLanguage={() => { closePicker(); setChoosingLanguage(true); }} onParents={() => setOverlay("parents")} onPrivacy={() => setOverlay("privacy")} onHow={() => setOverlay("how")} />
    {choosingLanguage && <LanguagePicker onSelect={selectLanguage}
      onClose={closePicker} pending={pending} error={error} />}
    {pending && <p className="entry-loading-status" role="status">{translate(languageId, "Loading lessons…")}</p>}
    {error && pickerLevel && <div className="entry-loading-status" role="alert">{translate(languageId, "The selected language could not load. Please try again.")} <button className="quiet-button" onClick={() => explore(pickerLevel.id)}>{translate(languageId, "Try again")}</button></div>}
    {overlay === "parents" && <ParentGuide onClose={() => setOverlay(null)} onPrivacy={() => setOverlay("privacy")} />}
    {overlay === "privacy" && <Privacy onClose={() => setOverlay(null)} />}
    {overlay === "how" && <HowItWorks onClose={() => setOverlay(null)} />}
  </LocaleContext.Provider>;
}
