import { create } from 'zustand';

interface UiState {
  isModalOpen: boolean;
  isSidebarOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  isModalOpen: false,
  isSidebarOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));