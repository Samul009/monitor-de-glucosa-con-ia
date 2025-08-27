import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Appbar, Surface, ActivityIndicator, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegistroComida({ onCancel, onSave }) {
  const [comida, setComida] = useState('');
  const [glucosa, setGlucosa] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleGuardarRegistro = async () => {
    if (!comida.trim()) {
      setSnackbarMessage('Por favor, ingresa la comida para guardar el registro.');
      setSnackbarVisible(true);
      return;
    }

    setLoading(true);
    
    try {
      const nuevoRegistro = {
        fecha: new Date().toISOString(),
        comida: comida.trim(),
        glucosa: glucosa.trim() || 'No registrado',
      };
      
      const registrosPrevios = JSON.parse(await AsyncStorage.getItem('registrosAlimentacion')) || [];
      const nuevosRegistros = [...registrosPrevios, nuevoRegistro];
      
      await AsyncStorage.setItem('registrosAlimentacion', JSON.stringify(nuevosRegistros));
      
      setComida('');
      setGlucosa('');
      setSnackbarMessage('Registro guardado exitosamente');
      setSnackbarVisible(true);
      onSave();
    } catch (error) {
      console.error(error);
      setSnackbarMessage('Hubo un problema al guardar el registro.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.contentContainer}>
      

      <ScrollView style={styles.scrollView}>
        <Surface style={styles.surface} elevation={2}>
          <Text variant="headlineSmall" style={styles.sectionTitle}>
            Nueva Comida
          </Text>
          
          <TextInput
            label="Describe tu comida"
            mode="outlined"
            multiline
            numberOfLines={3}
            value={comida}
            onChangeText={setComida}
            style={styles.input}
            disabled={loading}
          />
          
          <TextInput
            label="Nivel de glucosa (mg/dL)"
            mode="outlined"
            keyboardType="numeric"
            value={glucosa}
            onChangeText={setGlucosa}
            style={styles.input}
            disabled={loading}
          />
          
          {loading ? (
            <ActivityIndicator animating={true} size="large" style={styles.loader} />
          ) : (
            <View style={styles.formButtons}>
              <Button 
                mode="contained" 
                onPress={handleGuardarRegistro}
                style={styles.formButton}
                icon="content-save"
              >
                Guardar
              </Button>
              <Button 
                mode="outlined" 
                onPress={onCancel}
                style={styles.formButton}
                icon="cancel"
              >
                Cancelar
              </Button>
            </View>
          )}
        </Surface>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: { 
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  surface: {
    padding: 20,
    borderRadius: 8,
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    color: '#333', 
    marginBottom: 20,
    textAlign: 'center'
  },
  input: { 
    marginBottom: 15 
  },
  formButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20 
  },
  formButton: { 
    flex: 1, 
    marginHorizontal: 5 
  },
  loader: {
    marginVertical: 30
  }
});