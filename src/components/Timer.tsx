import { useState, useEffect, useRef } from 'react';

export default function Timer() {
  const [isStopwatch, setIsStopwatch] = useState(true);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 10);
      }, 10);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(2, '0')}`;
  };

  const handleLap = () => {
    setLaps((prev) => [time, ...prev]);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setIsStopwatch(true)}
          className={`px-4 py-2 rounded ${
            isStopwatch ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Cronómetro
        </button>
        <button
          onClick={() => setIsStopwatch(false)}
          className={`px-4 py-2 rounded ${
            !isStopwatch ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Temporizador
        </button>
      </div>

      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg">
        <h2 className="text-6xl font-mono mb-8">{formatTime(time)}</h2>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-6 py-2 rounded ${
              isRunning ? 'bg-red-500' : 'bg-green-500'
            } text-white`}
          >
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          {isStopwatch && (
            <button
              onClick={handleLap}
              disabled={!isRunning}
              className="px-6 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Vuelta
            </button>
          )}
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-gray-500 text-white rounded"
          >
            Reiniciar
          </button>
        </div>

        {isStopwatch && laps.length > 0 && (
          <div className="mt-8 max-h-60 overflow-y-auto">
            {laps.map((lap, index) => (
              <div
                key={index}
                className="py-2 border-b dark:border-gray-700 text-lg"
              >
                Vuelta {laps.length - index}: {formatTime(lap)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO-optimized content */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Temporizador y Cronómetro</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Nuestra aplicación no solo ofrece funciones de reloj y alarma, sino que también incluye un temporizador y cronómetro integrados. Estas herramientas de gestión de tiempo son ideales para cocinar, estudiar, ejercitarte y cualquier otra actividad que requiera medir intervalos específicos.
        </p>
      </div>
    </div>
  );
}