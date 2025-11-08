import { create } from "zustand";

import { FolderStructureStoreState } from "../Types/types";
import { buildApiUrl } from "../src/utils/api";

const folderStructureStore = create<FolderStructureStoreState>()((set) => ({
  folderStructure: null,
  setFolderStructure: async (playgroundId) => {
    const response = await fetch(
      buildApiUrl(`/tree/${playgroundId}`)
    );
    set({ folderStructure: await response.json() });
  },
}));

export default folderStructureStore;
