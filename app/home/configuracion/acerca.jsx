import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, Card, Text, Divider } from 'react-native-paper';


export default function Acerca({ cambiarPantalla }) {

  return (
    <View style={styles.fullScreen}>
      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Glucosa App</Text>
            <Text variant="bodyMedium" style={styles.centerText}>Versión 1.0.0</Text>
            <Divider style={styles.divider} />
            <Text style={styles.aboutText}>
              Esta aplicación ha sido diseñada para ayudarte a llevar un control
              detallado y organizado de tus niveles de glucosa, presión arterial
              y otros datos de salud importantes. Con ella, puedes registrar tus
              mediciones diarias, generar informes y llevar un seguimiento de
              tu progreso de manera sencilla e intuitiva.
            </Text>
            <Divider style={styles.divider} />
            <Text variant="bodySmall" style={styles.centerText}>
              Desarrollado por [Tu Nombre o Compañía]
            </Text>
            <Text variant="bodySmall" style={styles.centerText}>
              © 2025 Todos los derechos reservados.
            </Text>
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
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#009FDA',
    textAlign: 'center',
  },
  centerText: {
    textAlign: 'center',
    marginBottom: 5,
  },
  divider: {
    marginVertical: 15,
  },
  aboutText: {
    textAlign: 'justify',
    marginBottom: 15,
    lineHeight: 22,
  },
});
