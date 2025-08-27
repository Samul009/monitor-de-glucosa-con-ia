import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Card, Text, Switch, List, Divider, Button } from 'react-native-paper';

export default function Notificaciones({ cambiarPantalla }) {
  const [generalEnabled, setGeneralEnabled] = useState(true);
  const [glucosaEnabled, setGlucosaEnabled] = useState(false);
  const [tensionEnabled, setTensionEnabled] = useState(true);

  const toggleSwitchGeneral = () => setGeneralEnabled(previousState => !previousState);
  const toggleSwitchGlucosa = () => setGlucosaEnabled(previousState => !previousState);
  const toggleSwitchTension = () => setTensionEnabled(previousState => !previousState);

  const handleSave = () => {
   
    alert("Preferencias guardadas con éxito.");
  };

  return (
    <View style={styles.fullScreen}>
      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Alertas de la Aplicación</Text>
            <List.Section>
              <List.Item
                title="Notificaciones generales"
                description="Recibir notificaciones sobre actualizaciones y recordatorios."
                right={() => (
                  <Switch
                    value={generalEnabled}
                    onValueChange={toggleSwitchGeneral}
                    color="#009FDA"
                  />
                )}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="Alertas de Glucosa"
                description="Recibir recordatorios para registrar tus niveles de glucosa."
                right={() => (
                  <Switch
                    value={glucosaEnabled}
                    onValueChange={toggleSwitchGlucosa}
                    color="#009FDA"
                  />
                )}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="Alertas de Tensión"
                description="Recibir recordatorios para registrar tu tensión arterial."
                right={() => (
                  <Switch
                    value={tensionEnabled}
                    onValueChange={toggleSwitchTension}
                    color="#009FDA"
                  />
                )}
                style={styles.listItem}
              />
            </List.Section>
            
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.button}
            >
              Guardar preferencias
            </Button>
          </Card.Content>
        </Card>
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
  scrollContainer: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    elevation: 6,
    padding: 10,
  },
  cardTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#009FDA',
    textAlign: 'center',
  },
  listItem: {
    paddingVertical: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#009FDA',
  },
});
