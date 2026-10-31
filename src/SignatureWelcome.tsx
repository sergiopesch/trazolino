import { Component, lazy, Suspense, useState, type ReactNode } from "react";
import { PlayIcon } from "@phosphor-icons/react";
import { Modal } from "./Modal.jsx";
import { useLocale } from "./i18n.jsx";

const SignaturePlayer = lazy(() => import("./signature/SignaturePlayer.jsx"));
class SignatureBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <img className="signature-still" src="/brand/signature.svg" alt="Trazolino" width="700" height="230" /> : this.props.children; }
}
export function SignatureWelcome() {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  return <div className="signature-welcome">
    <button className="quiet-button" onClick={() => setOpen(true)}><PlayIcon size={16} />{t("Watch our signature come to life")}</button>
    {open && <Modal title="Trazolino" onClose={() => setOpen(false)} className="signature-modal">
      <SignatureBoundary><Suspense fallback={<img className="signature-still" src="/brand/signature.svg" alt="Trazolino" width="700" height="230" />}>
        <SignaturePlayer />
      </Suspense></SignatureBoundary>
    </Modal>}
  </div>;
}
