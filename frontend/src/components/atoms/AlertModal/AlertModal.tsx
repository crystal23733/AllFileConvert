import { FC } from "react";
import AlertModalProps from "./AlertModal.types";

const AlertModal: FC<AlertModalProps> = ({ open, message, onClose, confirmLabel = "확인" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full text-center">
        <div className="mb-4 text-base text-gray-800">{message}</div>
        <button
          className="mt-2 py-2 px-6 bg-blue-600 text-white rounded font-semibold shadow hover:bg-blue-700 transition"
          onClick={onClose}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
