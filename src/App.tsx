import { useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

function App() {
  const [status, setStatus] = useState('Listo para programar');

  // 1. Solicitar permisos de notificación (Android los requiere)
  const solicitarPermisos = async () => {
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display === 'granted') {
      setStatus('Permisos concedidos');
    } else {
      setStatus('Permisos denegados');
    }
  };

  // 2. Programar una alarma/notificación para dentro de 10 segundos
  const programarAlarmaRapida = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "¡Alarma Activa!",
          body: "Este es tu recordatorio programado desde Termux.",
          id: 1,
          schedule: { at: new Date(Date.now() + 10000) }, // 10000ms = 10 segundos
          sound: 'default',
          actionTypeId: '',
          extra: null
        }
      ]
    });
    setStatus('Alarma programada para dentro de 10s');
  };

  // 3. Programar una notificación con horario repetitivo (ej: Cada mañana a las 8:00 AM)
  const programarHorarioFijo = async () => {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Rutina Matutina",
          body: "Es hora de revisar tu aplicación.",
          id: 2,
          schedule: {
            on: { hour: 8, minute: 0 }, // 08:00 AM
            repeats: true // Se repite todos los días a esa hora
          }
        }
      ]
    });
    setStatus('Alarma diaria fijada a las 8:00 AM');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Mi App de Alarmas 📱</h2>
      <p>Estado: <strong>{status}</strong></p>
      
      <button onClick={solicitarPermisos} style={{ display: 'block', margin: '10px auto', padding: '10px' }}>
        1. Conceder Permisos
      </button>
      
      <button onClick={programarAlarmaRapida} style={{ display: 'block', margin: '10px auto', padding: '10px' }}>
        2. Alarma de prueba (10 segundos)
      </button>

      <button onClick={programarHorarioFijo} style={{ display: 'block', margin: '10px auto', padding: '10px' }}>
        3. Alarma Diaria (8:00 AM)
      </button>
    </div>
  );
}

export default App;

