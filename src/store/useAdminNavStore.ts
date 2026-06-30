import { create } from "zustand"
import { DummyNavGroup, adminNavData } from "@/dummyData/adminNavData"

interface AdminNavState {
  navGroups: DummyNavGroup[]
  setNavGroups: (groups: DummyNavGroup[]) => void
}

export const useAdminNavStore = create<AdminNavState>((set) => ({
  navGroups: adminNavData,
  setNavGroups: (groups) => set({ navGroups: groups }),
}))
