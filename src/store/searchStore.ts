import { create } from 'zustand';

interface SearchState {
  filters: Record<string, any>;
  searchQuery: string;
  setFilters: (filters: Record<string, any>) => void;
  setSearchQuery: (query: string) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: {},
  searchQuery: '',
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));