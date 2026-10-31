import { useLocale } from "./i18n.jsx";
import { Modal } from "./Modal.jsx";

export function ParentGuide({ onClose, onPrivacy }: { onClose: () => void; onPrivacy: () => void }) {
  const { t } = useLocale();
  return <Modal title={t("For grown-ups")} onClose={onClose}>
    <ol className="how-steps">
      <li><strong>{t("Paper, a pencil")}</strong>{t(" and optional colours")}.</li>
      <li><strong>{t("Watch and listen.")}</strong> {t("We show one little part. Voice is optional.")}</li>
      <li><strong>{t("Try it on paper.")}</strong> {t("Pause keeps the picture visible while you draw. Resume this step continues; Next step moves on.")}</li>
    </ol>
    <p className="gentle-note">{t("Stay alongside. Different lines, extra time and skipped details are welcome.")}</p>
    <div className="dialog-actions"><button className="quiet-button" onClick={onPrivacy}>{t("Privacy & supervision")}</button><button className="primary" onClick={onClose}>{t("Done")}</button></div>
  </Modal>;
}
