import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorldClock {
  city: string;
  timezone: string;
  favorite: boolean;
}

interface ClockStore {
  worldClocks: WorldClock[];
  addWorldClock: (clock: WorldClock) => void;
  removeWorldClock: (timezone: string) => void;
  toggleFavorite: (timezone: string) => void;
  reorderClocks: (clocks: WorldClock[]) => void;
}

const defaultClocks: WorldClock[] = [
  { city: 'Nueva York', timezone: 'America/New_York', favorite: true },
  { city: 'Londres', timezone: 'Europe/London', favorite: true },
  { city: 'Tokio', timezone: 'Asia/Tokyo', favorite: true },
  { city: 'París', timezone: 'Europe/Paris', favorite: false },
  { city: 'Sídney', timezone: 'Australia/Sydney', favorite: false }
];

const useClockStore = create<ClockStore>()(
  persist(
    (set) => ({
      worldClocks: defaultClocks,
      addWorldClock: (clock) =>
        set((state) => ({
          worldClocks: [...state.worldClocks, clock]
        })),
      removeWorldClock: (timezone) =>
        set((state) => ({
          worldClocks: state.worldClocks.filter((c) => c.timezone !== timezone)
        })),
      toggleFavorite: (timezone) =>
        set((state) => ({
          worldClocks: state.worldClocks.map((c) =>
            c.timezone === timezone ? { ...c, favorite: !c.favorite } : c
          )
        })),
      reorderClocks: (clocks) =>
        set(() => ({
          worldClocks: clocks
        }))
    }),
    {
      name: 'clock-storage'
    }
  )
);

export default useClockStore;