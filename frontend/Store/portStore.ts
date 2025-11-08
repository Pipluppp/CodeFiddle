import { create } from "zustand";

import { PortStoreState } from "../Types/types";

const portStore = create<PortStoreState>()((set) => ({
  port: null,
  error: null,
  setPort: (port) => set({ port }),
  setError: (message) => set({ error: message }),
}));

export default portStore;
