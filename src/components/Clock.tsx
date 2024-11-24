import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { QuestionMarkCircleIcon, StarIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import useClockStore from '../stores/clockStore';
import useSettingsStore from '../stores/settingsStore';

// Fallback timezones if Intl.supportedValuesOf is not available
const TIMEZONES = [
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Europe/Paris',
  'Australia/Sydney',
  'Asia/Dubai',
  'America/Los_Angeles',
  'Asia/Shanghai'
];

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [showHelp, setShowHelp] = useState(false);
  const [showAddCity, setShowAddCity] = useState(false);
  const { settings } = useSettingsStore();
  const { worldClocks, addWorldClock, removeWorldClock, toggleFavorite } = useClockStore();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <button
          onClick={() => setShowAddCity(true)}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Añadir Ciudad
        </button>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <QuestionMarkCircleIcon className="w-5 h-5 mr-1" />
          {showHelp ? 'Ocultar ayuda' : 'Mostrar ayuda'}
        </button>
      </div>

      {showHelp && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-bold mb-2">Guía del Reloj Mundial</h3>
          <ul className="space-y-2 text-sm">
            <li>• Consulta la hora y fecha actual de cualquier ciudad del mundo desde esta página.</li>
            <li>• Visualiza la diferencia horaria entre tu ubicación y otras ciudades.</li>
            <li>• La página muestra el reloj con la hora exacta de tu región y una lista de relojes de las principales ciudades.</li>
            <li>• Haz clic en el nombre de una ciudad para ver su reloj en detalle.</li>
            <li>• Tus preferencias de visualización se guardarán para futuras visitas.</li>
          </ul>
        </div>
      )}

      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-6xl font-bold mb-4">
          {time.toLocaleTimeString('es-ES', {
            hour12: !settings.is24HourFormat,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          {format(time, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          {Intl.DateTimeFormat().resolvedOptions().timeZone}
        </p>
      </div>

      {showAddCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Añadir Ciudad</h3>
              <button onClick={() => setShowAddCity(false)}>
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {TIMEZONES.map((timezone) => (
                <button
                  key={timezone}
                  onClick={() => {
                    addWorldClock({
                      city: timezone.split('/').pop()?.replace('_', ' ') || timezone,
                      timezone,
                      favorite: false
                    });
                    setShowAddCity(false);
                  }}
                  className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {timezone.split('/').pop()?.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {worldClocks.map((clock) => (
          <div
            key={clock.timezone}
            className="p-4 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-between"
          >
            <div>
              <h3 className="font-bold">{clock.city}</h3>
              <p className="text-gray-500 dark:text-gray-400">{clock.timezone}</p>
            </div>
            <div className="flex items-center space-x-4">
              <p className="text-xl">
                {new Date().toLocaleTimeString('es-ES', {
                  timeZone: clock.timezone,
                  hour12: !settings.is24HourFormat,
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
              <button onClick={() => toggleFavorite(clock.timezone)}>
                {clock.favorite ? (
                  <StarIconSolid className="w-6 h-6 text-yellow-500" />
                ) : (
                  <StarIcon className="w-6 h-6 text-gray-400" />
                )}
              </button>
              <button
                onClick={() => removeWorldClock(clock.timezone)}
                className="text-red-500 hover:text-red-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Reloj en tiempo real</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Nuestra aplicación de reloj y alarma ofrece un reloj en tiempo real que muestra la hora actual de manera precisa y actualizada cada segundo. Con una interfaz clara y legible, podrás consultar la hora en cualquier momento, asegurando que nunca pierdas la noción del tiempo.
        </p>
      </div>
    </div>
  );
}