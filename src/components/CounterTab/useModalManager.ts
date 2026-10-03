import { useState } from 'react';
import { ModalState } from './ModalTypes';

export const useModalManager = () => {
  const [modals, setModals] = useState<ModalState>({
    isMentalHealthOpen: false,
    isGratitudeOpen: false,
    isCoffeeBreakfastModalOpen: false,
    isGoalModalOpen: false,
    isMotivationsModalOpen: false,
    isAnalyzerModalOpen: false,
    isTriggerDetectorOpen: false,
    isStateChartModalOpen: false,
  });

  const toggleModal = (key: keyof ModalState, isOpen: boolean) => {
    setModals((prev) => ({ ...prev, [key]: isOpen }));
  };

  return { modals, toggleModal };
};
