"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModalContainer } from "./modal-container";

export default function ModalController({ children, btnName = "Button Name" }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>{btnName}</Button>
      <ModalContainer isOpen={isOpen} setIsOpen={setIsOpen}>
        {children}
      </ModalContainer>
    </div>
  );
}
