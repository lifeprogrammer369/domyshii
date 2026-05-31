import { useState, useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences'; // Importamos el storage

function App() {
  const [status, setStatus] = useState('Cargando...');
  const [rutinas, setRutinas] = useState<any[]>([]);

  // 1. Cargar datos del almacenamiento local al iniciar la app
  useEffect(() => {
    const cargarDatos = async () => {
      const { value } = await Preferences.get({ key: 'mis_rutinas' });
      if (value) {
        setRutinas(JSON.parse(value));
      }
      setStatus('Datos cargados');
    };
    
    cargarDatos();
  }, []);

  // 2. Guardar datos en el almacenamiento y reprogramar notificaciones
  const guardarYProgramarRutina = async (nuevaRutina: any) => {
    const listaActualizada = [...rutinas, nuevaRutina];
    setRutinas(listaActualizada);

    // Guardar localmente
    await Preferences.set({
      key: 'mis_rutinas',
      value: JSON.stringify(listaActualizada),
    });

    // Programar la notificación nativa
    await LocalNotifications.schedule({
      notifications: [
        {
          title: nuevaRutina.titulo,
          body: "Es hora de tu rutina",
          id: Number(nuevaRutina.id), // Capacitor pide IDs numéricos
          schedule: {
            on: { hour: nuevaRutina.hora, minute: nuevaRutina.minuto },
            repeats: true
          }
        }
      ]
    });

    setStatus(`Rutina "${nuevaRutina.titulo}" guardada y programada`);
  };

  // Función de ejemplo para el botón
  const agregarRutinaEjemplo = () => {
    const nueva = {
      id: Date.now().toString().slice(-6), // Un ID numérico único corto
      titulo: "Nueva Tarea Semanal",
      hora: 14,
      minuto: 30
    };
    guardarYProgramarRutina(nueva);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>Mi App de Rutinas Persistentes 📱</h2>
      <p>Estado: <strong>{status}</strong></p>

      <button onClick={agregarRutinaEjemplo} style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white' }}>
        Añadir Rutina (14:30)
      </button>

      <h3>Mis Rutinas Guardadas:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {rutinas.map((rutina) => (
          <li key={rutina.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc' }}>
            {rutina.titulo} - {rutina.hora}:{rutina.minuto}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

