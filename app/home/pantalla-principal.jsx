
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Button, 
  Card, 
  Avatar, 
  List, 
  Chip,
  Appbar,
  ActivityIndicator
} from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
import { getUser } from '../data/userStorage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const sendMessageToAI = async (prompt) => {
  console.log("Enviando a la IA:", prompt);
  await new Promise(resolve => setTimeout(resolve, 2000));
  const ejemploRespuesta = "Tus niveles de glucosa están estables, mantén tu dieta actual para seguir así.";
  return ejemploRespuesta;
};

export default function Inicio({ cambiarPantalla }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sugerenciaIA, setSugerenciaIA] = useState('Cargando tu resumen...');
  const [ultimaMedicion, setUltimaMedicion] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [actionsTooltipVisible, setActionsTooltipVisible] = useState(false);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const storedUser = await getUser();
        setUsuario(storedUser);
        
        const isDemo = storedUser?.email === 'prueba@example.com';
        setIsDemoUser(isDemo);

        let registros = [];
        const registrosSalud = JSON.parse(await AsyncStorage.getItem('registrosSalud')) || [];
        const registrosGlucosa = JSON.parse(await AsyncStorage.getItem('registrosGlucosa')) || [];
        
        if (registrosSalud.length > 0) {
          registros = registrosSalud;
        } else if (registrosGlucosa.length > 0) {
          registros = registrosGlucosa;
        }
        
        if (registros.length > 0) {
          const ultimoRegistro = registros[registros.length - 1];
          let ultimaGlucosa = 'N/A';
          
          if (ultimoRegistro.glucosa) {
            const glucosaValues = Object.values(ultimoRegistro.glucosa);
            const primerValor = glucosaValues.find(g => g && g.valor);
            ultimaGlucosa = primerValor ? primerValor.valor : 'N/A';
          } else if (ultimoRegistro.ayunas) {
            ultimaGlucosa = ultimoRegistro.ayunas || ultimoRegistro.dosHorasDesayuno || 'N/A';
          }
          
          setUltimaMedicion(ultimaGlucosa);
          
          const latestRegistros = registros.slice(-7);
          let mensaje = `Analiza estos datos de glucosa de los últimos días y ofrece un resumen, conciso y fácil de entender. Por ejemplo: "Tus niveles de glucosa en ayunas son estables." o "Se observan picos en tu glucosa."`;
          
          if (isDemo) {
            mensaje += ` DATOS DE PRUEBA: ${JSON.stringify(latestRegistros.slice(0, 3), null, 2)}`;
          }
          
          const respuesta = await sendMessageToAI(mensaje);
          setSugerenciaIA(respuesta);
        } else {
          setUltimaMedicion('N/A');
          setSugerenciaIA('No hay suficientes datos para un análisis. ¡Empieza a registrar!');
        }
      } catch (error) {
        console.error("Error al cargar los datos:", error);
        setSugerenciaIA('Hubo un error al obtener la sugerencia.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <View style={styles.fullScreen}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content 
          title={usuario ? `¡Hola, ${usuario.nombre}!${isDemoUser ? ' (Demo)' : ''}` : 'Bienvenido'} 
          titleStyle={styles.appbarTitle}
        />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* Banner informativo para usuario demo */}
        {isDemoUser && (
          <Card style={styles.demoBanner}>
            <Card.Content>
              <View style={styles.demoContent}>
                <MaterialCommunityIcons name="information" size={24} color="#1976D2" />
                <View style={styles.demoText}>
                  <Text variant="titleSmall" style={styles.demoTitle}>Modo Demostración</Text>
                  <Text variant="bodySmall" style={styles.demoSubtitle}>
                    Estos son datos de prueba generados automáticamente. Puedes agregar nuevos registros que se combinarán con los datos demo.
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Tooltip para el resumen de IA */}
        <View style={styles.section}>
          <Tooltip
            isVisible={tooltipVisible}
            content={
              <View style={styles.tooltipContent}>
                <Text style={styles.tooltipText}>
                  Este análisis es generado automáticamente por IA basándose en tus últimos registros.
                  {"\n\n"}Se actualiza cada vez que agregas nuevos datos de glucosa.
                </Text>
              </View>
            }
            placement="bottom"
            onClose={() => setTooltipVisible(false)}
            backgroundColor="rgba(0,0,0,0.7)"
          >
            <TouchableOpacity activeOpacity={0.9} onPress={() => setTooltipVisible(true)}>
              <Card style={styles.summaryCard}>
                <Card.Content>
                  <View style={styles.summaryContent}>
                    <Avatar.Icon size={60} icon="heart-plus-outline" style={styles.summaryAvatar} />
                    <View style={styles.summaryTextContainer}>
                      <View style={styles.titleWithIcon}>
                        <Text variant="titleMedium" style={styles.summaryTitle}>Tu estado de salud hoy</Text>
                        <MaterialCommunityIcons 
                          name="information-outline" 
                          size={16} 
                          color="#73777F" 
                          style={styles.infoIcon}
                        />
                      </View>
                      {loading ? (
                        <ActivityIndicator animating={true} color="#009FDA" style={{ marginTop: 8 }} />
                      ) : (
                        <>
                          <Text variant="bodyMedium" style={styles.summarySubtitle}>
                            Última medición: {ultimaMedicion} mg/dL {isDemoUser ? '(Demo)' : ''}
                          </Text>
                          <Chip 
                            icon="star-four-points" 
                            style={styles.statusChip}
                            textStyle={{ textAlign: 'center' }}
                          >
                            {sugerenciaIA}
                          </Chip>
                        </>
                      )}
                    </View>
                  </View>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </Tooltip>
        </View>

        {/* Sección de acciones rápidas con Tooltip */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={styles.sectionTitle}>Acciones Rápidas</Text>
            <Tooltip
              isVisible={actionsTooltipVisible}
              content={
                <View style={styles.tooltipContent}>
                  <Text style={styles.tooltipText}>
                    Acciones frecuentes para gestionar tu diabetes.
                    {"\n"}Haz clic en cualquier opción para acceder rápidamente.
                  </Text>
                </View>
              }
              placement="left"
              onClose={() => setActionsTooltipVisible(false)}
              backgroundColor="rgba(0,0,0,0.7)"
            >
              <TouchableOpacity onPress={() => setActionsTooltipVisible(true)}>
                <MaterialCommunityIcons 
                  name="information-outline" 
                  size={20} 
                  color="#73777F" 
                />
              </TouchableOpacity>
            </Tooltip>
          </View>
          <List.Section style={styles.listSection}>
            <List.Item
              title="Registrar Glucosa y Presión"
              titleStyle={{color: '#000000'}}
              description="Agregar nuevos registros de salud"
              descriptionStyle={{color: '#73777F'}}
              left={props => <List.Icon {...props} icon="heart-pulse" color="#009FDA" />}
              right={props => <MaterialCommunityIcons {...props} name="chevron-right" size={24} color="#009FDA" />}
              onPress={() => cambiarPantalla('Estadisticas')}
              style={styles.listItem}
            />
            <List.Item
              title="Registrar Alimentación"
              titleStyle={{color: '#000000'}}
              description="Registra tus comidas y carbohidratos"
              descriptionStyle={{color: '#73777F'}}
              left={props => <List.Icon {...props} icon="food-apple" color="#009FDA" />}
              right={props => <MaterialCommunityIcons {...props} name="chevron-right" size={24} color="#009FDA" />}
              onPress={() => cambiarPantalla('Alimentacion')}
              style={styles.listItem}
            />
          </List.Section>
        </View>

        {/* Sección de Análisis */}
        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>Análisis y Reportes</Text>
          <Button
            mode="contained"
            onPress={() => cambiarPantalla('Estadisticas')}
            icon="chart-line"
            style={styles.fullWidthButton}
            contentStyle={{ paddingVertical: 10 }}
          >
            Ver mis estadísticas
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  appbar: {
    backgroundColor: '#009FDA',
  },
  appbarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollContainer: {
    padding: 20,
  },
  demoBanner: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 4,
    borderLeftColor: '#1976D2',
  },
  demoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  demoText: {
    flex: 1,
    marginLeft: 12,
  },
  demoTitle: {
    fontWeight: 'bold',
    color: '#1976D2',
  },
  demoSubtitle: {
    color: '#1565C0',
    marginTop: 4,
  },
  summaryCard: {
    marginBottom: 20,
    borderRadius: 15,
    elevation: 4,
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryAvatar: {
    backgroundColor: '#009FDA',
    marginRight: 15,
  },
  summaryTextContainer: {
    flex: 1,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryTitle: {
    fontWeight: 'bold',
    color: '#000000',
  },
  infoIcon: {
    marginLeft: 6,
  },
  summarySubtitle: {
    color: '#73777F',
  },
  statusChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 8,
  },
  listSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
  },
  listItem: {
    paddingVertical: 8,
  },
  fullWidthButton: {
    width: '100%',
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: '#009FDA',
  },
  tooltipContent: {
    padding: 10,
    backgroundColor: '#000', 
    borderRadius: 10,
  },
  tooltipText: {
    color: '#FFF',
    textAlign: 'center',
    lineHeight: 20,
  },
});
