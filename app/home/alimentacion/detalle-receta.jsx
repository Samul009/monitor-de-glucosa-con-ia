import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Appbar } from 'react-native-paper';


export default function RecetaDetallada({ sugerencia, cambiarPantalla, titulo }) {

  if (!sugerencia) {
    return (
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => cambiarPantalla('Alimentación')} />
          <Appbar.Content title="Detalle de Receta" titleStyle={{ color: '#FFFFFF' }} />
        </Appbar.Header>
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No hay detalles para mostrar.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            {titulo && <Text variant="headlineSmall" style={styles.title}>{titulo}</Text>}
            <Text style={styles.sugerencia}>{sugerencia}</Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <Button
        mode="contained"
        onPress={() => cambiarPantalla('Alimentacion')}
        style={styles.button}
      >
        Volver
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  appbar: {
    backgroundColor: '#009FDA',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sugerencia: {
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    margin: 20,
    backgroundColor: '#009FDA',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#777',
  },
});