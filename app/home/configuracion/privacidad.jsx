import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Appbar, List, Divider, Text, Card } from 'react-native-paper';


export default function Privacidad({ cambiarPantalla }) {

  const handlePress = (option) => {
    const opciones = [
      {id: '1', title: 'Cambiar Contraseña', icon: 'lock-reset', tab: 'Cambiar Contraseña'},
      {id: '2', title: 'Historial de Sesiones', icon: 'history', tab: 'Historial de Sesiones'},
      {id: '3', title: 'Gestion de Datos', icon: 'database', tab: 'Gestion de Datos'},
      {id: '4', title: 'Terminos y Condiciones', icon: 'shield-lock', tab: 'Terminos y Condiciones'},
    ];

    const seleccion = opciones.find(op => op.title === option);
    if (seleccion) {
      cambiarPantalla(seleccion.tab);
    } else {
      alert(`Has seleccionado: ${option}`);
    }
  };

  return (
    <View style={styles.fullScreen}>
      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Seguridad de la Cuenta</Text>
            <List.Section>
              <List.Item
                title="Cambiar Contraseña"
                description="Actualiza tu contraseña para mayor seguridad."
                left={props => <List.Icon {...props} icon="lock-reset" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handlePress('Cambiar Contraseña')}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="Historial de Sesiones"
                description="Ver los dispositivos y ubicaciones donde has iniciado sesión."
                left={props => <List.Icon {...props} icon="history" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handlePress('Historial de Sesiones')}
                style={styles.listItem}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Control de Datos</Text>
            <List.Section>
              <List.Item
                title="Gestión de Datos"
                description="Exporta o elimina tus datos personales de salud."
                left={props => <List.Icon {...props} icon="database" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handlePress('Gestion de Datos')}
                style={styles.listItem}
              />
              <Divider />
              <List.Item
                title="Términos y Condiciones"
                description="Lee nuestros términos de servicio y política de privacidad."
                left={props => <List.Icon {...props} icon="file-document-outline" />}
                right={props => <List.Icon {...props} icon="chevron-right" />}
                onPress={() => handlePress('Terminos y Condiciones')}
                style={styles.listItem}
              />
            </List.Section>
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
    marginBottom: 20,
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
});
