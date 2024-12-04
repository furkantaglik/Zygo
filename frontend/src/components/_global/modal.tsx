"use client";
import { useSearchParams, useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isOpen) return null;

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleOverlayClick = () => {
    const newParams = new URLSearchParams();
    router.push(`?${newParams.toString()}`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-background rounded-lg shadow-lg w-full max-w-lg mx-4 border border-accent absolute bottom-16 md:bottom-auto"
        onClick={handleModalClick}
      >
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-accent">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={handleOverlayClick} className="hover:text-primary">
              ✕
            </button>
          </div>
        )}

        <div className="p-4">{children}</div>
        {footer && (
          <div className="p-4 border-t border-accent flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
