import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { locations } from "#constants";
import type { Location } from "#constants/types";

const DEFAULT_LOCATION = locations.work;

type LocationStore = {
  activeLocation: Location;
  actions: {
    setActiveLocation: (location: Location) => void;
    resetActiveLocation: () => void;
  };
};

const useLocationStore = create<LocationStore>()(
  immer((set) => ({
    activeLocation: DEFAULT_LOCATION,

    actions: {
      setActiveLocation: (location: Location) =>
        set((state) => {
          state.activeLocation = location;
        }),
      resetActiveLocation: () =>
        set((state) => {
          state.activeLocation = DEFAULT_LOCATION;
        }),
    },
  })),
);

export const useActiveLocation = () =>
  useLocationStore((state) => state.activeLocation);
export const useLocationActions = () =>
  useLocationStore((state) => state.actions);
