"use client";

import { create } from "zustand";

export type Scenario = "current" | "optimized" | "aggressive";

export type POStatus = "Draft" | "In Review" | "Approved" | "Rejected";

export type ApprovedPO = {
  styleId: string;
  factoryId: string;
  qty: number;
  poNumber: string;
};

type AppState = {
  selectedStyleIds: string[];
  setSelectedForPO: (ids: string[]) => void;
  clearSelection: () => void;

  scenario: Scenario;
  setScenario: (s: Scenario) => void;

  poStatuses: Record<string, POStatus>;
  poNumbers: Record<string, string>;
  setPoStatus: (styleId: string, status: POStatus, poNumber?: string) => void;

  filterRegions: string[];
  filterCategory: string;
  filterAction: string;
  setFilterRegions: (r: string[]) => void;
  setFilterCategory: (c: string) => void;
  setFilterAction: (a: string) => void;
};

export const useAppStore = create<AppState>((set) => ({
  selectedStyleIds: [],
  setSelectedForPO: (ids) => set({ selectedStyleIds: ids }),
  clearSelection: () => set({ selectedStyleIds: [] }),

  scenario: "current",
  setScenario: (scenario) => set({ scenario }),

  poStatuses: {},
  poNumbers: {},
  setPoStatus: (styleId, status, poNumber) =>
    set((state) => ({
      poStatuses: { ...state.poStatuses, [styleId]: status },
      poNumbers: poNumber
        ? { ...state.poNumbers, [styleId]: poNumber }
        : state.poNumbers,
    })),

  filterRegions: [],
  filterCategory: "All",
  filterAction: "All",
  setFilterRegions: (filterRegions) => set({ filterRegions }),
  setFilterCategory: (filterCategory) => set({ filterCategory }),
  setFilterAction: (filterAction) => set({ filterAction }),
}));
