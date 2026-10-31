import copy from "./about-copy.json";
import { languageFromSearch, languageHref } from "./locale-url.ts";

const locale = languageFromSearch(location.search, [...Object.keys(copy), "en-IE", "en-GB-x-scotland"]);
const words = copy[locale as keyof typeof copy] ?? copy["en-GB"];
document.documentElement.lang = locale;
document.title = words.title;
for (const element of document.querySelectorAll<HTMLElement>("[data-about]")) {
  const key = element.dataset.about as keyof typeof words;
  if (Object.hasOwn(words, key)) element.textContent = words[key];
}
document.querySelector('meta[name="description"]')?.setAttribute("content", words.description);
document.querySelector(".about-brand")?.setAttribute("aria-label", words.home);
document.querySelector(".about-actions")?.setAttribute("aria-label", words.explore);
for (const link of document.querySelectorAll<HTMLAnchorElement>('a[href="/"]'))
  link.href = languageHref("/", locale);
