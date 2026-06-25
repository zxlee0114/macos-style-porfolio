import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import type {
  FileItem,
  Location,
  WindowConfig,
  WindowKey,
} from "#constants/types";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "#constants";

type WindowData = FileItem | Location | null;

type WindowActions = {
  openWindow: (key: WindowKey, data?: WindowData) => void;
  closeWindow: (key: WindowKey) => void;
  focusWindow: (key: WindowKey) => void;
};

type WindowStore = {
  windows: WindowConfig;
  nextZIndex: number;
  actions: WindowActions;
};

const useWindowStore = create<WindowStore>()(
  immer((set) => ({
    windows: structuredClone(WINDOW_CONFIG),
    nextZIndex: INITIAL_Z_INDEX + 1,
    actions: {
      openWindow: (key, data = null) =>
        set((state) => {
          const win = state.windows[key];
          if (!win) return;
          win.isOpen = true;
          win.zIndex = state.nextZIndex;
          if (data !== undefined) win.data = data;
          state.nextZIndex++;
        }),

      closeWindow: (key) =>
        set((state) => {
          const win = state.windows[key];
          if (!win) return;
          win.isOpen = false;
          win.zIndex = INITIAL_Z_INDEX;
          win.data = null;
        }),

      focusWindow: (key) =>
        set((state) => {
          const win = state.windows[key];
          if (!win) return;
          win.zIndex = state.nextZIndex++;
        }),
    },
  })),
);

export const useWindows = () => useWindowStore((state) => state.windows);
export const useWindowNextZIndex = () =>
  useWindowStore((state) => state.nextZIndex);
export const useWindowActions = () => useWindowStore((state) => state.actions);
