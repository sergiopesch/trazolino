import { getLocale } from "./locale-registry.js";

export function documentTitle(locale: string) {
  return getLocale(locale)?.dynamic?.copy.documentTitle ?? (locale === "es-419"
    ? "Trazolino — Todo dibujo comienza con una pequeña línea"
    : "Trazolino — Every drawing starts with a little line");
}
