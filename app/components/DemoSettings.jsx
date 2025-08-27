// DemoSettings.jsx - Componente para gestionar datos demo
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Button, Text, Divider, ActivityIndicator } from 'react-native-paper';
import { resetDemoData, clearDemoData } from '../services/demoDataService';

export default function DemoSettings({ usuario, onDataChanged }) {
  const [loading, setLoading] = useState(false);
  
  // Solo mostrar si es usuario demo
  if (!usuario || usuario.email !== 'prueba@example.com') {
    return null;
  }

  const handleResetData = () => {
    Alert.alert(
      "Reinicializar Datos Demo",
      "¿Estás seguro de que quieres reinicializar todos los datos de prueba? Esto reemplazará todos los registros actuales.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí, reinicializar",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const success = await resetDemoData();
              if (success) {
                Alert.alert("Éxito", "Los datos de prueba han sido reinicializados correctamente.");
                if (onDataChanged) onDataChanged();
              } else {
                Alert.alert("Error", "No se pudieron reinicializar los datos.");
              }
            } catch (error) {
              console.error('Error al reinicializar datos:', error);
              Alert.alert("Error", "Ocurrió un error inesperado.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      "Limpiar Todos los Datos",
      "¿Estás seguro de que quieres eliminar TODOS los registros? Esta acción no se puede deshacer.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí, eliminar todo",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              const success = await clearDemoData();
              if (success) {
                Alert.alert("Éxito", "Todos los datos han sido eliminados.");
                if (onDataChanged) onDataChanged();
              } else {
                Alert.alert("Error", "No se pudieron eliminar los datos.");
              }
            } catch (error) {
              console.error('Error al limpiar datos:', error);
              Alert.alert("Error", "Ocurrió un error inesperado.");
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.title}>
          Configuración Demo
        </Text>
        <Text variant="bodyMedium" style={styles.description}>
          Gestiona los datos de prueba de tu cuenta de demostración.
        </Text>
        
        <Divider style={styles.divider} />
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} color="#009FDA" />
            <Text style={styles.loadingText}>Procesando...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleResetData}
              style={[styles.button, styles.resetButton]}
              icon="refresh"
            >
              Reinicializar Datos Demo
            </Button>
            
            <Text variant="bodySmall" style={styles.buttonDescription}>
              Reemplaza todos los registros con nuevos datos de prueba
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleClearData}
              style={[styles.button, styles.clearButton]}
              textColor="#D32F2F"
              icon="delete"
            >
              Limpiar Todos los Datos
            </Button>
            
            <Text variant="bodySmall" style={styles.buttonDescription}>
              Elimina completamente todos los registros
            </Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 10,
    marginHorizontal: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  title: {
    fontWeight: 'bold',
    color: '#E65100',
    marginBottom: 8,
  },
  description: {
    color: '#F57C00',
    marginBottom: 15,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#FFB74D',
  },
  buttonContainer: {
    gap: 10,
  },
  button: {
    marginVertical: 5,
  },
  resetButton: {
    backgroundColor: '#009FDA',
  },
  clearButton: {
    borderColor: '#D32F2F',
  },
  buttonDescription: {
    color: '#8D6E63',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#FF9800',
  },
});