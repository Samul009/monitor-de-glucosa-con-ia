import AsyncStorage from '@react-native-async-storage/async-storage';

// Función para generar datos de prueba
const generateDemoData = () => {
  const today = new Date();
  const registrosSalud = [];
  
  // Generar días de datos de prueba
  for (let i = 14; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
   
    const glucosaBase = 95 + Math.random() * 50; 
    const variacion = (Math.random() - 0.5) * 15; 
    
    // Generar algunos registros 
    const tipoRegistro = i % 3 === 0 ? 'tensionArterial' : 'glucosa';
    
    const registroCompleto = {
      fecha: date.toISOString(),
      tipo: tipoRegistro,
      glucosa: {
        ayunas: { 
          valor: tipoRegistro === 'glucosa' ? Math.round(glucosaBase + variacion).toString() : '',
          observaciones: tipoRegistro === 'glucosa' && i % 6 === 0 ? 'Medición en ayunas completas' : '' 
        },
        dosHorasDesayuno: { 
          valor: tipoRegistro === 'glucosa' && i % 2 === 0 ? Math.round(glucosaBase + variacion + 35).toString() : '',
          observaciones: '' 
        },
        antesAlmuerzo: { 
          valor: tipoRegistro === 'glucosa' && i % 3 !== 0 ? Math.round(glucosaBase + variacion - 8).toString() : '',
          observaciones: '' 
        },
        dosHorasAlmuerzo: { 
          valor: tipoRegistro === 'glucosa' && i % 2 !== 0 ? Math.round(glucosaBase + variacion + 28).toString() : '',
          observaciones: tipoRegistro === 'glucosa' && i % 8 === 0 ? 'Post almuerzo con carbohidratos' : '' 
        },
        antesCena: { 
          valor: tipoRegistro === 'glucosa' && i % 4 === 0 ? Math.round(glucosaBase + variacion - 3).toString() : '',
          observaciones: '' 
        },
        dosHorasCena: { 
          valor: tipoRegistro === 'glucosa' && i % 3 === 1 ? Math.round(glucosaBase + variacion + 22).toString() : '',
          observaciones: '' 
        },
        tresAM: { 
          valor: i % 10 === 0 ? Math.round(glucosaBase + variacion + 5).toString() : '', 
          observaciones: i % 10 === 0 ? 'Control nocturno' : '' 
        },
      },
      tensionArterial: {
        AM: { 
          sistolica: (tipoRegistro === 'tensionArterial' || i % 4 === 0) ? 
                     Math.round(118 + (Math.random() - 0.5) * 24).toString() : '',
          diastolica: (tipoRegistro === 'tensionArterial' || i % 4 === 0) ? 
                      Math.round(78 + (Math.random() - 0.5) * 16).toString() : '',
          pulso: (tipoRegistro === 'tensionArterial' || i % 4 === 0) ? 
                 Math.round(68 + (Math.random() - 0.5) * 24).toString() : '',
          observaciones: (tipoRegistro === 'tensionArterial' && i % 5 === 0) ? 'Medición matutina en reposo' : '' 
        },
        PM: { 
          sistolica: tipoRegistro === 'tensionArterial' ? 
                     Math.round(122 + (Math.random() - 0.5) * 28).toString() : '',
          diastolica: tipoRegistro === 'tensionArterial' ? 
                      Math.round(80 + (Math.random() - 0.5) * 20).toString() : '',
          pulso: tipoRegistro === 'tensionArterial' ? 
                 Math.round(72 + (Math.random() - 0.5) * 28).toString() : '',
          observaciones: (tipoRegistro === 'tensionArterial' && i % 6 === 0) ? 'Después de actividad laboral' : '' 
        },
      },
      actividadFisica: i % 3 === 0 ? 'Caminata 30 min' : 
                       i % 5 === 0 ? 'Ejercicio cardiovascular 45 min' : 
                       i % 7 === 0 ? 'Yoga 20 min' : '',
      medicacion: i % 2 === 0 ? 'Metformina 850mg - mañana y noche' : 'Metformina 500mg - con desayuno',
      observacionesGenerales: i % 8 === 0 ? 'Día con estrés laboral elevado' : 
                              i % 12 === 0 ? 'Excelente control glucémico hoy' :
                              i % 15 === 0 ? 'Cambio en rutina alimentaria' : '',
    };
    
    registrosSalud.push(registroCompleto);
  }
  
  // Datos de alimentación de prueba 
  const registrosAlimentacion = [];
  for (let i = 10; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const comidas = [
      'Desayuno: 2 tostadas integrales con palta y huevo escalfado',
      'Almuerzo: Pollo a la plancha con quinoa y ensalada verde',
      'Once: Yogurt natural con nueces y arándanos',
      'Cena: Salmón al horno con brócoli y batata asada',
      'Colación: Manzana verde con 10 almendras',
      'Almuerzo: Lentejas estofadas con zanahoria y apio',
      'Desayuno: Avena con canela, plátano y semillas de chía',
      'Cena: Ensalada de garbanzos con verduras mixtas',
      'Almuerzo: Pescado al vapor con arroz integral',
      'Desayuno: Omelet de vegetales con espinaca',
      'Cena: Pechuga de pavo con puré de coliflor'
    ];
    
    const glucosaPostComida = ['98', '112', '128', '105', '118', '94', '122', '108', '115', '102', '125'];
    
    // Generar registros de alimentación
    if (i % 2 === 0) {
      registrosAlimentacion.push({
        fecha: date.toISOString(),
        comida: comidas[i % comidas.length],
        glucosa: glucosaPostComida[i % glucosaPostComida.length],
      });
    }
  }
  
  return { registrosSalud, registrosAlimentacion };
};


// Función para inicializar datos demo si es usuario de prueba
export const initializeDemoDataIfNeeded = async (usuario) => {
  if (!usuario || usuario.email !== 'prueba@example.com') {
    return false; // No es usuario de prueba
  }
  
  try {
    // Verificar si ya existen datos
    const existingHealth = await AsyncStorage.getItem('registrosSalud');
    const existingFood = await AsyncStorage.getItem('registrosAlimentacion');
    
    // Solo inicializar si no hay datos existentes
    if (!existingHealth || !existingFood || 
        JSON.parse(existingHealth || '[]').length === 0 || 
        JSON.parse(existingFood || '[]').length === 0) {
      
      console.log('🎯 Inicializando datos de prueba para usuario demo...');
      
      const { registrosSalud, registrosAlimentacion } = generateDemoData();
      
      await AsyncStorage.setItem('registrosSalud', JSON.stringify(registrosSalud));
      await AsyncStorage.setItem('registrosAlimentacion', JSON.stringify(registrosAlimentacion));
      
      console.log('✅ Datos de prueba inicializados correctamente');
      console.log(`📊 ${registrosSalud.length} registros de salud creados`);
      console.log(`🍽️ ${registrosAlimentacion.length} registros de alimentación creados`);
      
      return true;
    }
    
    return false; 
  } catch (error) {
    console.error(' Error al inicializar datos de prueba:', error);
    return false;
  }
};


export const resetDemoData = async () => {
  try {
    const { registrosSalud, registrosAlimentacion } = generateDemoData();
    
    await AsyncStorage.setItem('registrosSalud', JSON.stringify(registrosSalud));
    await AsyncStorage.setItem('registrosAlimentacion', JSON.stringify(registrosAlimentacion));
    
    console.log(' Datos de prueba reinicializados');
    return true;
  } catch (error) {
    console.error(' Error al resetear datos de prueba:', error);
    return false;
  }
};


export const clearAllData = async () => {
  try {
    const dataKeys = ['registrosSalud', 'registrosAlimentacion'];
    await AsyncStorage.multiRemove(dataKeys);
    console.log(' Todos los datos de salud y alimentación eliminados.');
    return true;
  } catch (error) {
    console.error(' Error al limpiar todos los datos:', error);
    return false;
  }
};
