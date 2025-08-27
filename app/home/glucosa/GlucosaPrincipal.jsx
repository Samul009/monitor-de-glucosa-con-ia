import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, FAB } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendMessageToAI } from '../../services/aiService';
import GlucosaForm from './GlucosaForm';
import GlucosaDashboard from './GlucosaDashboard';
import { useIsFocused } from '@react-navigation/native';

export default function GlucosaPrincipal({ cambiarPantalla }) {
   
    const [view, setView] = useState('dashboard');
    const [registros, setRegistros] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sugerenciaIA, setSugerenciaIA] = useState('Analizando tus datos...');
    const [registro, setRegistro] = useState({
        fecha: new Date().toISOString(),
        tipo: 'glucosa',
        glucosa: {
            ayunas: { valor: '', observaciones: '' },
            dosHorasDesayuno: { valor: '', observaciones: '' },
            antesAlmuerzo: { valor: '', observaciones: '' },
            dosHorasAlmuerzo: { valor: '', observaciones: '' },
            antesCena: { valor: '', observaciones: '' },
            dosHorasCena: { valor: '', observaciones: '' },
            tresAM: { valor: '', observaciones: '' },
        },
        tensionArterial: {
            AM: { sistolica: '', diastolica: '', pulso: '', observaciones: '' },
            PM: { sistolica: '', diastolica: '', pulso: '', observaciones: '' },
        },
        actividadFisica: '',
        medicacion: '',
        observacionesGenerales: '',
    });

    const isFocused = useIsFocused();

   
    useEffect(() => {
        if (isFocused) {
            cargarRegistros();
        }
    }, [isFocused]);

    // Función para cargar los registros de salud
    const cargarRegistros = async () => {
        setLoading(true);
        try {
            const registrosGuardados = await AsyncStorage.getItem('registrosSalud');
            const parsedRegistros = registrosGuardados ? JSON.parse(registrosGuardados) : [];
            setRegistros(parsedRegistros);
            
            const latestRegistros = parsedRegistros.slice(-7);
            if (latestRegistros.length > 0) {
                enviarResumenAI(latestRegistros);
            } else {
                setSugerenciaIA('No hay suficientes datos para un análisis. ¡Empieza a registrar!');
            }
        } catch (error) {
            console.error("Error al cargar registros:", error);
            Alert.alert("Error", "No se pudo cargar el historial.");
            setSugerenciaIA('Hubo un error al obtener la sugerencia.');
        } finally {
            setLoading(false);
        }
    };

    // Función para enviar datos a la IA
    const enviarResumenAI = async (datos) => {
        const mensaje = `Analiza estos datos de glucosa y tensión arterial de los últimos días y ofrece un resumen y una recomendación de una sola frase, concisa y fácil de entender. 
        Datos: ${JSON.stringify(datos, null, 2)}`;
        
        try {
            const respuesta = await sendMessageToAI(mensaje);
            setSugerenciaIA(respuesta);
        } catch (error) {
            console.error(error);
            setSugerenciaIA("No se pudo obtener una sugerencia de la IA.");
        }
    };

    // Función para manejar los cambios en el formulario
    const handleInputChange = (section, key, value, timeKey) => {
        setRegistro(prev => {
            if (section === 'glucosa' || section === 'tensionArterial') {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [timeKey]: {
                            ...prev[section][timeKey],
                            [key]: value,
                        },
                    },
                };
            } else {
                return { ...prev, [key]: value };
            }
        });
    };

    // Función para guardar el registro en AsyncStorage
    const handleSave = async () => {
        const tieneDatos = (registro.tipo === 'glucosa' && Object.values(registro.glucosa).some(val => val.valor)) ||
                           (registro.tipo === 'tensionArterial' && Object.values(registro.tensionArterial).some(val => val.sistolica || val.diastolica)) ||
                           registro.actividadFisica || registro.medicacion || registro.observacionesGenerales;

        if (!tieneDatos) {
            Alert.alert("Error", "Por favor, ingresa al menos un valor para guardar.");
            return;
        }

        setLoading(true);
        try {
            const registrosPrevios = JSON.parse(await AsyncStorage.getItem('registrosSalud')) || [];
            const fechaActual = new Date().toISOString().split('T')[0];
            const indiceRegistroExistente = registrosPrevios.findIndex(
                (reg) => reg.fecha.split('T')[0] === fechaActual
            );

            let nuevosRegistros = [...registrosPrevios];
            if (indiceRegistroExistente !== -1) {
                nuevosRegistros[indiceRegistroExistente] = { ...nuevosRegistros[indiceRegistroExistente], ...registro };
            } else {
                nuevosRegistros.push(registro);
            }

            await AsyncStorage.setItem('registrosSalud', JSON.stringify(nuevosRegistros));
            
            Alert.alert("Éxito", "Registro guardado correctamente.");
            
            setRegistro({
                fecha: new Date().toISOString(),
                tipo: 'glucosa',
                glucosa: { ayunas: { valor: '', observaciones: '' }, dosHorasDesayuno: { valor: '', observaciones: '' }, antesAlmuerzo: { valor: '', observaciones: '' }, dosHorasAlmuerzo: { valor: '', observaciones: '' }, antesCena: { valor: '', observaciones: '' }, dosHorasCena: { valor: '', observaciones: '' }, tresAM: { valor: '', observaciones: '' } },
                tensionArterial: { AM: { sistolica: '', diastolica: '', pulso: '', observaciones: '' }, PM: { sistolica: '', diastolica: '', pulso: '', observaciones: '' } },
                actividadFisica: '', medicacion: '', observacionesGenerales: '',
            });

            setView('dashboard');
            cargarRegistros();
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Hubo un problema al guardar el registro.");
        } finally {
            setLoading(false);
        }
    };

    if (view === 'form') {
        return (
            <View style={styles.fullScreen}>
                
                <GlucosaForm 
                    registro={registro} 
                    onInputChange={handleInputChange} 
                    onSave={handleSave} 
                    loading={loading}
                    setRegistro={setRegistro}
                />
            </View>
        );
    }

    return (
        <View style={styles.fullScreen}>
            
            <GlucosaDashboard 
                registros={registros} 
                loading={loading} 
                sugerenciaIA={sugerenciaIA} 
            />
            <FAB
                icon="plus"
                style={styles.fab}
                label="Nuevo Registro"
                onPress={() => setView('form')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    fullScreen: { flex: 1, backgroundColor: '#f2f2f7' },
    appbar: { backgroundColor: '#009FDA' },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#009FDA',
    },
});
