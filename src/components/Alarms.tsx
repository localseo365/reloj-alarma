import { useState } from 'react';
import { BellIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import useAlarmStore from '../stores/alarmStore';
import useSettingsStore from '../stores/settingsStore';

const ALARM_COLORS = [
  { name: 'Azul', value: 'bg-blue-500' },
  { name: 'Rojo', value: 'bg-red-500' },
  { name: 'Verde', value: 'bg-green-500' },
  { name: 'Morado', value: 'bg-purple-500' },
  { name: 'Amarillo', value: 'bg-yellow-500' }
];

const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function Alarms() {
  const { alarms, addAlarm, toggleAlarm, removeAlarm, testAlarm, updateAlarm } = useAlarmStore();
  const { settings } = useSettingsStore();
  const [editingAlarm, setEditingAlarm] = useState<number | null>(null);

  const handleAddAlarm = () => {
    addAlarm({
      id: Date.now(),
      time: '08:00',
      label: 'Nueva Alarma',
      enabled: true,
      days: [],
      sound: 'default',
      color: ALARM_COLORS[Math.floor(Math.random() * ALARM_COLORS.length)].value,
      volume: settings.volume
    });
  };

  const handleTestAlarm = (alarm: any) => {
    const button = document.querySelector(`[data-alarm-id="${alarm.id}"]`);
    if (button) {
      button.classList.add('animate-ping');
      setTimeout(() => button.classList.remove('animate-ping'), 1000);
    }

    testAlarm(alarm);
  };

  const handleColorChange = (alarmId: number, color: string) => {
    updateAlarm(alarmId, { color });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Mis Alarmas</h2>
          <button
            onClick={handleAddAlarm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Nueva Alarma
          </button>
        </div>

        <div className="space-y-4">
          {alarms.map((alarm) => (
            <div
              key={alarm.id}
              className={`p-4 rounded-lg ${alarm.enabled ? alarm.color : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              {editingAlarm === alarm.id ? (
                <div className="space-y-4">
                  <input
                    type="time"
                    value={alarm.time}
                    onChange={(e) => updateAlarm(alarm.id, { time: e.target.value })}
                    className="w-full p-2 rounded bg-white dark:bg-gray-800"
                  />
                  <input
                    type="text"
                    value={alarm.label}
                    onChange={(e) => updateAlarm(alarm.id, { label: e.target.value })}
                    className="w-full p-2 rounded bg-white dark:bg-gray-800"
                    placeholder="Etiqueta de la alarma"
                  />
                  <div className="flex gap-2">
                    {ALARM_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorChange(alarm.id, color.value)}
                        className={`w-8 h-8 rounded-full ${color.value} ${
                          alarm.color === color.value ? 'ring-2 ring-white' : ''
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {WEEKDAYS.map((day, index) => (
                      <button
                        key={day}
                        onClick={() => {
                          const days = alarm.days.includes(index)
                            ? alarm.days.filter(d => d !== index)
                            : [...alarm.days, index];
                          updateAlarm(alarm.id, { days });
                        }}
                        className={`w-8 h-8 rounded-full ${
                          alarm.days.includes(index)
                            ? 'bg-white text-blue-500'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm">Volumen</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={alarm.volume}
                      onChange={(e) => updateAlarm(alarm.id, { volume: Number(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <button
                    onClick={() => setEditingAlarm(null)}
                    className="w-full p-2 bg-white text-blue-500 rounded"
                  >
                    Guardar
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-white">
                  <div>
                    <div className="text-2xl font-bold">{alarm.time}</div>
                    <div>{alarm.label}</div>
                    <div className="text-sm opacity-75">
                      {alarm.days.length > 0
                        ? alarm.days.map(d => WEEKDAYS[d]).join(', ')
                        : 'Una vez'}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      data-alarm-id={alarm.id}
                      onClick={() => handleTestAlarm(alarm)}
                      className="p-2 hover:bg-white/20 rounded transition-all"
                    >
                      <BellIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setEditingAlarm(alarm.id)}
                      className="p-2 hover:bg-white/20 rounded"
                    >
                      <PencilIcon className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        alarm.enabled ? 'bg-white' : 'bg-gray-400'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full transition-transform ${
                          alarm.enabled ? 'bg-blue-500 translate-x-6' : 'bg-gray-600'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => removeAlarm(alarm.id)}
                      className="p-2 hover:bg-white/20 rounded"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {alarms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay alarmas configuradas
            </div>
          )}
        </div>
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Alarma Múltiple</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Nuestra aplicación de reloj y alarma permite configurar múltiples alarmas para gestionar eficientemente tus horarios diarios. Ya sea para despertarte, recordar reuniones importantes o tomar tus medicamentos, puedes establecer alarmas personalizadas según tus necesidades.
        </p>
      </div>
    </div>
  );
}