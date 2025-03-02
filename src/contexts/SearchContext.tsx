'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchFilters {
  // Text search
  query: string;
  
  // Location filters
  location: string;
  distance: number; // in miles
  
  // Training style filters
  hasGi: boolean | null;
  hasNogi: boolean | null;
  hasKids: boolean | null;
  
  // Facility filters
  hasShowers: boolean | null;
  hasOpenMat: boolean | null;
  
  // Class type filters
  hasCompetitionTraining: boolean | null;
  hasWomensOnlyClasses: boolean | null;
  hasBeginnerClasses: boolean | null;
  
  // Schedule filters
  hasMorningClasses: boolean | null;
  hasEveningClasses: boolean | null;
  hasWeekendClasses: boolean | null;
  
  // Premium filter
  isPremium: boolean | null;
  
  // Sorting
  sortBy: 'distance' | 'name' | 'rating';
  sortDirection: 'asc' | 'desc';
}

const defaultFilters: SearchFilters = {
  query: '',
  location: '',
  distance: 25,
  hasGi: null,
  hasNogi: null,
  hasKids: null,
  hasShowers: null,
  hasOpenMat: null,
  hasCompetitionTraining: null,
  hasWomensOnlyClasses: null,
  hasBeginnerClasses: null,
  hasMorningClasses: null,
  hasEveningClasses: null,
  hasWeekendClasses: null,
  isPremium: null,
  sortBy: 'distance',
  sortDirection: 'asc'
};

interface SearchContextProps {
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  updateFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  resetFilters: () => void;
  activeFilterCount: number;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Calculate the number of active filters (excluding sorting and paging)
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    // Skip these fields when counting active filters
    if (['sortBy', 'sortDirection', 'query', 'location', 'distance'].includes(key)) return false;
    // Only count boolean filters that are explicitly true or false
    return value !== null;
  }).length;

  return (
    <SearchContext.Provider value={{
      filters,
      setFilters,
      updateFilter,
      resetFilters,
      activeFilterCount,
    }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
