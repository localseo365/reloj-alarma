import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Alarm {
  id: number;
  time: string;
  label: string;
  enabled: boolean;
  days: number[];
  sound: string;
  color: string;
  volume: number;
}

interface AlarmStore {
  alarms: Alarm[];
  addAlarm: (alarm: Alarm) => void;
  removeAlarm: (id: number) => void;
  toggleAlarm: (id: number) => void;
  testAlarm: (alarm: Alarm) => void;
  updateAlarm: (id: number, updates: Partial<Alarm>) => void;
}

const playAlarmSound = (alarm: Alarm) => {
  try {
    const volume = typeof alarm.volume === 'number' && isFinite(alarm.volume) 
      ? alarm.volume 
      : 50;
    
    const normalizedVolume = Math.max(0, Math.min(volume, 100)) / 100;
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440;
    gainNode.gain.setValueAtTime(normalizedVolume, audioContext.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 3);
    
    setTimeout(() => {
      audioContext.close();
    }, 3100);

    if ('vibrate' in navigator) {
      navigator.vibrate([1000, 500, 1000]);
    }
  } catch (error) {
    console.error('Error playing alarm:', error);
  }
};

const checkAndPlayAlarm = (alarm: Alarm) => {
  if (!alarm.enabled) return;

  const now = new Date();
  const [hours, minutes] = alarm.time.split(':').map(Number);
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();

  if (currentHours === hours && currentMinutes === minutes) {
    const currentDay = now.getDay();
    if (alarm.days.length === 0 || alarm.days.includes(currentDay)) {
      playAlarmSound(alarm);
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(alarm.label, {
          body: `¡Es hora! ${alarm.time}`,
          icon: '/alarm-icon.png'
        });
      }
    }
  }
};

const useAlarmStore = create<AlarmStore>()(
  persist(
    (set) => ({
      alarms: [],
      addAlarm: (alarm) => {
        set((state) => ({ alarms: [...state.alarms, alarm] }));
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }
      },
      removeAlarm: (id) =>
        set((state) => ({ alarms: state.alarms.filter((a) => a.id !== id) })),
      toggleAlarm: (id) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
          ),
        })),
      updateAlarm: (id, updates) =>
        set((state) => ({
          alarms: state.alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updates } : alarm
          ),
        })),
      testAlarm: (alarm) => {
        playAlarmSound(alarm);
      }
    }),
    {
      name: 'alarm-storage',
    }
  )
);

setInterval(() => {
  const { alarms } = useAlarmStore.getState();
  alarms.forEach(checkAndPlayAlarm);
}, 1000);

export default useAlarmStore;