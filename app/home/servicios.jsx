import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { 
  Text, 
  Appbar, 
  TextInput, 
  Badge
} from 'react-native-paper';
import Tooltip from 'react-native-walkthrough-tooltip';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2;

export default function Servicios({ cambiarPantalla }) {
  const [search, setSearch] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);

  const servicios = [
    { 
      id: '1', 
      title: 'Registrar Glucosa', 
      icon: 'water-percent', 
      tab: 'Estadisticas',
      tooltip: 'Registra tus niveles de glucosa y lleva un control detallado de tus mediciones'
    },
    { 
      id: '2', 
      title: 'Registrar Alimentación', 
      icon: 'food-apple', 
      tab: 'Alimentacion',
      tooltip: 'Controla tu dieta y registra los carbohidratos consumidos en cada comida'
    },
    { 
      id: '3', 
      title: 'IA y Análisis', 
      icon: 'robot', 
      tab: 'IA Analisis', 
      isNew: true,
      tooltip: 'Análisis inteligente de tus datos de salud mediante inteligencia artificial'
    },
    { 
      id: '4', 
      title: 'Generar Informes', 
      icon: 'file-chart', 
      tab: 'Informes',
      tooltip: 'Crea informes detallados para compartir con tu médico o especialista'
    },
    
  ];

  const serviciosFiltrados = servicios.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.fullScreen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TextInput
          label="Buscar servicio"
          mode="outlined"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          left={<TextInput.Icon icon="magnify" />}
        />

        <View style={styles.grid}>
          {serviciosFiltrados.map(servicio => (
            <Tooltip
              key={servicio.id}
              isVisible={activeTooltip === servicio.id}
              content={
                <View style={styles.tooltipContent}>
                  <Text style={styles.tooltipText}>{servicio.tooltip}</Text>
                </View>
              }
              placement="top"
              onClose={() => setActiveTooltip(null)}
              backgroundColor="rgba(0,0,0,0.7)"
            >
              <TouchableOpacity
                style={styles.card}
                onPress={() => cambiarPantalla(servicio.tab)}
                onLongPress={() => setActiveTooltip(servicio.id)}
                activeOpacity={0.7}
              >
                <View>
                  {servicio.isNew && (
                    <Badge 
                      style={styles.badge} 
                      size={20}
                    >
                      Nuevo
                    </Badge>
                  )}
                  <MaterialCommunityIcons
                    name={servicio.icon}
                    size={40}
                    color="#009FDA"
                    style={styles.cardIcon}
                  />
                </View>
                <Text style={styles.cardTitle}>{servicio.title}</Text>
              </TouchableOpacity>
            </Tooltip>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { 
    flex: 1, 
    backgroundColor: '#f2f2f7' 
  },
  appbar: { 
    backgroundColor: '#009FDA' 
  },
  scrollContainer: { 
    padding: 15 
  },
  searchInput: { 
    marginBottom: 20 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  card: {
    width: cardWidth,
    height: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  cardIcon: { 
    marginBottom: 10 
  },
  cardTitle: { 
    fontWeight: 'bold', 
    textAlign: 'center',
    fontSize: 14 
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5733',
  },
  tooltipContent: {
    padding: 10,
    maxWidth: 200,
  },
  tooltipText: {
    color: 'white',
    textAlign: 'center',
    lineHeight: 18,
  },
});