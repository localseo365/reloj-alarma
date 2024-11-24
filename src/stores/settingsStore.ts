import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Settings {
  isDarkMode: boolean;
  volume: number;
  vibrationEnabled: boolean;
  is24HourFormat: boolean;
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
}

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: {
        isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        volume: 80,
        vibrationEnabled: true,
        is24HourFormat: true,
      },
      updateSettings: (updates) =>
        set((state) => {
          const newSettings = { ...state.settings, ...updates };
          if ('isDarkMode' in updates) {
            document.documentElement.classList.toggle('dark', updates.isDarkMode);
          }
          return { settings: newSettings };
        }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

// Initialize dark mode on load
const { settings } = useSettingsStore.getState();
document.documentElement.classList.toggle('dark', settings.isDarkMode);

export default useSettingsStore;