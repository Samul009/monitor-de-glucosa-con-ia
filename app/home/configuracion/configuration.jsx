
import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

import {
  Text,
  List,
  Avatar,
  Button,
  Appbar,
  Divider,
  Dialog,
  Portal,
  Snackbar,
  Surface,
  Searchbar,
  Chip,
  Badge,
  TouchableRipple,
} from 'react-native-paper';
import { getUser, clearUser } from '../../data/userStorage';


export default function Configuracion({ cambiarPantalla }) {
  const [usuario, setUsuario] = useState({ nombre: '', email: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUsuario(storedUser);
        } else {
         
          cambiarPantalla('Login');
        }
      } catch (error) {
        console.log('Error cargando usuario:', error);
      }
    };
    fetchUsuario();
  }, []);

  const handleLogout = async () => {
    try {
      await clearUser();
      setIsSnackbarVisible(true);
    } catch (error) {
      console.log('Error cerrando sesión:', error);
    }
  };

  const opciones = [
    { id: '1', title: 'Perfil de usuario', description: 'Ver y editar tu información personal', icon: 'account-circle-outline', tab: 'Perfil de Usuario' },
    { id: '2', title: 'Notificaciones', description: 'Ajustar tus preferencias de alertas', icon: 'bell-outline', tab: 'Notificaciones' },
    { id: '3', title: 'Privacidad y seguridad', description: 'Gestionar tu cuenta y permisos', icon: 'lock-outline', tab: 'Privacidad' },
    { id: '4', title: 'Acerca de', description: 'Información sobre la aplicación y el autor', icon: 'information-outline', tab: 'Acerca de' },
  ];

  const filteredOpciones = opciones.filter(opcion =>
    opcion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
 
  const onSnackbarDismiss = () => {
    setIsSnackbarVisible(false);
    cambiarPantalla('Login'); 
  };

  return (
    <View style={styles.fullScreen}>
      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Muevo el Searchbar al inicio */}
        <Searchbar
          placeholder="Buscar..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        <Surface style={styles.profileSection} elevation={4}>
          <View>
            <Avatar.Icon size={70} icon="account-circle" style={{ backgroundColor: '#009FDA' }} />
            <Badge style={styles.badge} size={20}>Nuevo</Badge>
          </View>
          <Text variant="titleLarge" style={styles.userName}>{usuario.nombre || 'Nombre de Usuario'}</Text>
          <Text variant="bodyMedium" style={styles.userEmail}>{usuario.email || 'usuario@email.com'}</Text>
          <Chip icon="account-check-outline" style={{ marginTop: 10 }}>Premium</Chip>
        </Surface>

        <Text style={styles.subheader}>Opciones de la aplicación</Text>
        <Divider style={{ marginVertical: 10 }} />

        <Surface style={styles.listSection} elevation={2}>
          {filteredOpciones.map(({ id, title, description, icon, tab }) => (
            <TouchableRipple key={id} onPress={() => cambiarPantalla(tab)}>
              <List.Item
                title={title}
                titleStyle={{color: '#000000'}}
                description={description}
                descriptionStyle={{color: '#73777F'}}
                left={props => (
                  <List.Icon {...props} icon={icon} color="#009FDA" />
                )}
                right={props => <List.Icon {...props} icon="chevron-right" color="#009FDA" />}
                style={styles.listItem}
              />
            </TouchableRipple>
          ))}
        </Surface>

        <Button
          mode="contained"
          onPress={() => setIsDialogVisible(true)}
          icon="logout"
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
        >
          Cerrar sesión
        </Button>
      </ScrollView>

      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setIsDialogVisible(false)}>
          <Dialog.Title>Cerrar sesión</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que quieres cerrar tu sesión?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancelar</Button>
            <Button onPress={() => {
              setIsDialogVisible(false);
              handleLogout();
            }}>Cerrar Sesión</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={onSnackbarDismiss}
        action={{
          label: 'OK',
          onPress: onSnackbarDismiss,
        }}
        style={{ backgroundColor: '#4caf50' }}
      >
        Sesión cerrada con éxito.
      </Snackbar>
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
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#D32F2F',
  },
  userName: {
    marginTop: 10,
    fontWeight: 'bold',
    color: '#000000',
  },
  userEmail: {
    color: '#73777F',
  },
  searchbar: {
    marginBottom: 15,
    borderRadius: 15,
  },
  listSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
  },
  listItem: {
    paddingVertical: 10,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#73777F',
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#D32F2F',
    borderRadius: 15,
  },
  logoutButtonText: {
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});