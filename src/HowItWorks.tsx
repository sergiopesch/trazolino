import { ArrowRightIcon } from "@phosphor-icons/react";
import { useLocale } from "./i18n.jsx";
import { Modal } from "./Modal.jsx";

export function HowItWorks({ onClose }: { onClose: () => void }) {
  const { t } = useLocale();
  return (
    <Modal title={t("A little step. Then your turn.")} onClose={onClose}>
      <ol className="how-steps">
        <li>
          <strong>{t("Choose together.")}</strong> {t("Pick any level and a drawing that interests you.")}
        </li>
        <li>
          <strong>{t("Watch and listen.")}</strong> {t("We show one little part. Voice is optional.")}
        </li>
        <li>
          <strong>{t("Try it on paper.")}</strong> {t("A quiet drawing break follows each demonstration. The next part starts gently on its own.")}
        </li>
      </ol>
      <p className="gentle-note">
        {t("Pause keeps the picture visible while you draw. Resume this step continues; Next step moves on.")}
      </p>
      <button className="primary wide" onClick={onClose}>
        {t("Let’s explore")} <ArrowRightIcon size={21} />
      </button>
    </Modal>
  );
}
