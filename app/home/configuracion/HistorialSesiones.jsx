import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, List, Divider, Text, Card } from 'react-native-paper';


const generateSessionData = () => {
  const sessions = [
    { device: 'Samsung S22', location: 'Quibdó, Colombia', date: new Date(Date.now() - 3600000).toLocaleString(), icon: 'cellphone' },
    { device: 'Desktop Chrome', location: 'Quibdó, Colombia', date: new Date(Date.now() - 86400000).toLocaleString(), icon: 'monitor' },
    { device: 'iPhone 13', location: 'Medellín, Colombia', date: new Date(Date.now() - 604800000).toLocaleString(), icon: 'apple' },
  ];
  return sessions;
};

export default function HistorialSesiones({ navigation }) {
  const sessions = generateSessionData();

  return (
    <View style={styles.fullScreen}>
      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Dispositivos Activos</Text>
            <List.Section>
              {sessions.map((session, index) => (
                <View key={index}>
                  <List.Item
                    title={session.device}
                    description={`Ubicación: ${session.location}\nFecha y Hora: ${session.date}`}
                    left={props => <List.Icon {...props} icon={session.icon} />}
                  />
                  {index < sessions.length - 1 && <Divider />}
                </View>
              ))}
            </List.Section>
          </Card.Content>
        </Card>
        <Text style={styles.disclaimer}>
          Esta es una lista simulada de los últimos inicios de sesión. Para cerrar sesión en un dispositivo, cambie su contraseña.
        </Text>
      </ScrollView>
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
  scrollContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#009FDA',
    textAlign: 'center',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#73777F',
    marginTop: 10,
    paddingHorizontal: 10,
  },
});
