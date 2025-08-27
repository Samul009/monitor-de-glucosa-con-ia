import React, { useState, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Avatar, Text, ActivityIndicator, Portal, Dialog, Snackbar } from 'react-native-paper';
import usuarios from './data/usuario.json';
import { saveUser, getUser } from './data/userStorage';
import { clearAllData, initializeDemoDataIfNeeded } from './services/demoDataService';

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Verificar si ya hay un usuario logueado
  useEffect(() => {
    const checkLoggedIn = async () => {
      setCheckingLogin(false);
    };
    checkLoggedIn();
  }, []);

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      setSnackbarMessage('Por favor ingresa tu correo y contraseña.');
      setIsSnackbarVisible(true);
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      setLoading(false);
      const usuarioEncontrado = usuarios.find(
        (u) => u.email.toLowerCase() === correo.toLowerCase()
      );

      if (usuarioEncontrado) {
        if (usuarioEncontrado.password === contrasena) {
          await clearAllData(); 
          
          await saveUser(usuarioEncontrado);

          // Verifica si el usuario es el "demo" y crea los datos de salud si es necesario
          await initializeDemoDataIfNeeded(usuarioEncontrado);

          setDialogMessage(`¡Bienvenido, ${usuarioEncontrado.nombre}!`);
          setIsDialogVisible(true);
        } else {
          setSnackbarMessage('Datos de acceso incorrectos.');
          setIsSnackbarVisible(true);
        }
      } else {
        setSnackbarMessage('El usuario no existe.');
        setIsSnackbarVisible(true);
      }
    }, 1500);
  };

  if (checkingLogin) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#009FDA" />
      </View>
    );
  }

  const handleDialogDismiss = () => {
    setIsDialogVisible(false);
    if (dialogMessage.includes('Bienvenido')) {
      onLogin(); 
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5FAFD' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Avatar.Icon
          size={90}
          icon="water"
          style={{ backgroundColor: '#009FDA', marginBottom: 20 }}
        />

        <Text variant="headlineMedium" style={styles.title}>
          Control de Glucosa
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Usuario: prueba@example.com
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Password: 456
        </Text>
        <TextInput
          label="Correo electrónico"
          mode="outlined"
          value={correo}
          onChangeText={setCorreo}
          style={styles.input}
        />

        <TextInput
          label="Contraseña"
          mode="outlined"
          secureTextEntry
          value={contrasena}
          onChangeText={setContrasena}
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </Button>

        <Button mode="text" onPress={() => {
          setSnackbarMessage('Registro de cuenta estará disponible pronto.');
          setIsSnackbarVisible(true);
        }}>
          Crear cuenta
        </Button>

        <Text style={styles.separator}>O inicia sesión con tu cuenta de Google o Apple</Text>

        <View style={styles.socialButtonsContainer}>
          <Button
            mode="contained"
            onPress={() => {
              setSnackbarMessage('Inicio de sesión con Google estará disponible pronto.');
              setIsSnackbarVisible(true);
            }}
            icon="google"
            style={[styles.socialButton, { backgroundColor: '#DB4437' }]}
            labelStyle={styles.socialButtonText}
          >
            Google
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              setSnackbarMessage('Inicio de sesión con Apple estará disponible pronto.');
              setIsSnackbarVisible(true);
            }}
            icon="apple"
            style={[styles.socialButton, { backgroundColor: '#000000' }]}
            labelStyle={styles.socialButtonText}
          >
            Apple
          </Button>
        </View>

        {loading && (
          <ActivityIndicator animating={true} color="#009FDA" style={{ marginTop: 10 }} />
        )}

      </View>
      
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={handleDialogDismiss}>
          <Dialog.Title>Acceso Correcto</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDialogDismiss}>Continuar</Button>
          </Dialog.Actions>
        </Dialog>

        <Snackbar
          visible={isSnackbarVisible}
          onDismiss={() => setIsSnackbarVisible(false)}
          action={{
            label: 'OK',
            onPress: () => setIsSnackbarVisible(false),
          }}
          style={{ backgroundColor: '#D32F2F' }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  title: {
    marginBottom: 30,
    fontWeight: 'bold',
    color: '#009FDA',
  },
  input: {
    width: '100%',
    marginBottom: 15,
  },
  button: {
    width: '100%',
    marginTop: 10,
    paddingVertical: 5,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 5,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 10,
    color: '#73777F',
    textAlign: 'center',
  },
});
