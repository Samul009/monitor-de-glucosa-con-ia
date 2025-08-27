import React, { useState } from 'react';
import { View, StyleSheet, Alert, Clipboard } from 'react-native';
import { Appbar, Button, Card, Text, ActivityIndicator, Portal, Dialog, Paragraph } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAllData } from '../../services/demoDataService';

export default function GestionDatos({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const handleExportData = async () => {
    try {
      setLoading(true);
      const allKeys = await AsyncStorage.getAllKeys();
      const dataKeys = allKeys.filter(key => key.includes('registros'));
      const data = await AsyncStorage.multiGet(dataKeys);
      
      const jsonData = {};
      data.forEach(([key, value]) => {
        jsonData[key] = JSON.parse(value);
      });

      const jsonString = JSON.stringify(jsonData, null, 2);
      
      await Clipboard.setString(jsonString);
      
      Alert.alert(
        'Datos Exportados',
        'Tus datos de salud han sido copiados al portapapeles. Puedes pegarlos en cualquier documento de texto.'
      );
    } catch (e) {
      console.error('Error al exportar datos:', e);
      Alert.alert('Error', 'Hubo un problema al exportar tus datos.');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteData = () => {
    setIsDialogVisible(true);
  };

  const handleDeleteData = async () => {
    setIsDialogVisible(false);
    try {
      setLoading(true);
      await clearAllData();
      Alert.alert(
        'Datos Eliminados',
        'Tus datos de salud han sido eliminados de este dispositivo.'
      );
   
      navigation.goBack();
    } catch (e) {
      console.error('Error al eliminar datos:', e);
      Alert.alert('Error', 'Hubo un problema al eliminar tus datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.fullScreen}>
     

      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Control de Datos Personales</Text>
            <Text style={styles.text}>
              Aquí puedes gestionar todos los datos de salud que has registrado en la aplicación.
            </Text>
            <Button
              mode="contained"
              onPress={handleExportData}
              style={styles.button}
              disabled={loading}
              loading={loading}
              icon="export"
            >
              Exportar Mis Datos
            </Button>
            <Button
              mode="contained"
              onPress={confirmDeleteData}
              style={[styles.button, styles.deleteButton]}
              disabled={loading}
              icon="delete"
            >
              Eliminar Todos Mis Datos
            </Button>
          </Card.Content>
        </Card>
      </View>
      
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>Confirmar Eliminación</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              ¿Estás seguro de que quieres eliminar todos tus datos de salud? Esta acción no se puede deshacer.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancelar</Button>
            <Button onPress={handleDeleteData}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: '#F5FAFD',
  },
  appBar: {
    backgroundColor: '#009FDA',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 10,
  },
  cardTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#009FDA',
    textAlign: 'center',
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#73777F',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#009FDA',
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
});
