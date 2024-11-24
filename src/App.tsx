import { useEffect } from 'react';
import { useState } from 'react';
import Clock from './components/Clock';
import Alarms from './components/Alarms';
import Timer from './components/Timer';
import Settings from './components/Settings';
import BackToTop from './components/BackToTop';
import useSettingsStore from './stores/settingsStore';

const tabs = [
  { id: 'clock', label: 'Reloj' },
  { id: 'alarms', label: 'Alarmas' },
  { id: 'timer', label: 'Temporizador' },
  { id: 'settings', label: 'Ajustes' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('clock');
  const { settings } = useSettingsStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.isDarkMode);
  }, [settings.isDarkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-300 dark:bg-slate-700 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <a href="/" className="block">
            <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">
              ALARMIX
            </h1>
          </a>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 mt-20">
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 sm:flex sm:space-x-4 gap-2 sm:gap-0 w-full sm:w-auto bg-white dark:bg-gray-800 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <main className="mt-4">
          {activeTab === 'clock' && <Clock />}
          {activeTab === 'alarms' && <Alarms />}
          {activeTab === 'timer' && <Timer />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>

      <BackToTop />
    </div>
  );
}