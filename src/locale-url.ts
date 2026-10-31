// URL preferences carry no session or child information and do not load lessons.
export function languageFromSearch(search: string, supported: readonly string[]) {
  const id = new URLSearchParams(search).get("lang");
  return id && supported.includes(id) ? id : "en-GB";
}

export function languageHref(path: string, locale: string) {
  return locale === "en-GB" ? path : `${path}?${new URLSearchParams({ lang: locale })}`;
}
