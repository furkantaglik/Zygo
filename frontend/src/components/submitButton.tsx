"use client";
import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  className?: string;
};

export default function SubmitButton({
  children,
  className = "",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "Loading..." : children}
    </button>
  );
}
