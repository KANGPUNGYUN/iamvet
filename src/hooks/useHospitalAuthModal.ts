"use client";

import { useState } from "react";
import { HospitalAuthModalHandler } from "@/utils/hospitalAuthGuard";

export function useHospitalAuthModal(): HospitalAuthModalHandler {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalReturnUrl, setModalReturnUrl] = useState<string | undefined>();

  const showModal = (returnUrl?: string) => {
    setModalReturnUrl(returnUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalReturnUrl(undefined);
  };

  return {
    showModal,
    isModalOpen,
    closeModal,
    modalReturnUrl,
  };
}