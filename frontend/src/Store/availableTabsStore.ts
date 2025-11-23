import { create } from "zustand";

import { AvailableTabsStoreState } from "../Types/types";

const availableTabsStore = create<AvailableTabsStoreState>()((set, get) => ({
  availableTabs: {},
  addOrUpdateAvailableTabs: (path) => {
    const currentTabs = { ...get().availableTabs };
    Object.keys(currentTabs).forEach((key) => {
      currentTabs[key] = false;
    });
    currentTabs[path] = true;
    set({ availableTabs: currentTabs });
  },
  removeTab: (path) => {
    const currentTabs = get().availableTabs;

    if (!Object.prototype.hasOwnProperty.call(currentTabs, path)) {
      return null;
    }

    const isRemovingActive = Boolean(currentTabs[path]);
    const remainingKeys = Object.keys(currentTabs).filter((key) => key !== path);

    if (remainingKeys.length === 0) {
      set({ availableTabs: {} });
      return isRemovingActive ? null : null;
    }

    const newState: Record<string, boolean> = {};
    remainingKeys.forEach((key) => {
      newState[key] = false;
    });

    if (isRemovingActive) {
      const fallbackPath = remainingKeys[remainingKeys.length - 1];
      newState[fallbackPath] = true;
      set({ availableTabs: newState });
      return fallbackPath;
    }

    const previouslyActive = Object.entries(currentTabs).find(
      ([key, value]) => value && key !== path
    );

    const preservedPath = previouslyActive?.[0] || remainingKeys[remainingKeys.length - 1];
    newState[preservedPath] = true;
    set({ availableTabs: newState });
    return null;
  },
}));

export default availableTabsStore;
