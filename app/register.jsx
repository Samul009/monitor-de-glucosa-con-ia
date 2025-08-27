import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { 
  TextInput, 
  Button, 
  Avatar, 
  Text, 
  ActivityIndicator, 
  Portal, 
  Dialog, 
  Snackbar 
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import usuarios from './data/usuario.json';

export default function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Nuevos estados para los componentes de Paper
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [isSnackbarVisible, setIsSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const router = useRouter();

  const handleRegister = () => {
    
    if (!nombre || !correo || !contrasena || !confirmarContrasena) {
      setSnackbarMessage('Por favor llena todos los campos.');
      setIsSnackbarVisible(true);
      return;
    }

    if (contrasena !== confirmarContrasena) {
      setSnackbarMessage('Las contraseñas no coinciden.');
      setIsSnackbarVisible(true);
      return;
    }

    const existe = usuarios.find(user => user.email.toLowerCase() === correo.toLowerCase());
    if (existe) {
      setSnackbarMessage('El correo ya está registrado. Intenta iniciar sesión.');
      setIsSnackbarVisible(true);
      return;
    }

    setLoading(true);

  
    setTimeout(() => {
      setLoading(false);

      
      const nuevoUsuario = { nombre, email: correo, password: contrasena };
      usuarios.push(nuevoUsuario);

      
      setDialogMessage(`¡Cuenta creada para ${nombre}!`);
      setIsDialogVisible(true);
    }, 1500);
  };
  

  const handleDialogDismiss = () => {
    setIsDialogVisible(false);
    router.push('login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F5FAFD' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Avatar.Icon
            size={90}
            icon="account-plus"
            style={{ backgroundColor: '#009FDA', marginBottom: 20 }}
          />

          <Text variant="headlineMedium" style={styles.title}>
            Crear cuenta
          </Text>

          <TextInput
            label="Nombre completo"
            mode="outlined"
            value={nombre}
            onChangeText={setNombre}
            style={styles.input}
          />

          <TextInput
            label="Correo electrónico"
            mode="outlined"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
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

          <TextInput
            label="Confirmar contraseña"
            mode="outlined"
            secureTextEntry
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>

          <Button mode="text" onPress={() => router.push('login')}>
            Ya tengo una cuenta
          </Button>

          {loading && (
            <ActivityIndicator animating={true} color="#009FDA" style={{ marginTop: 10 }} />
          )}
        </View>
      </ScrollView>

      
      <Portal>
        
        <Dialog visible={isDialogVisible} onDismiss={handleDialogDismiss}>
          <Dialog.Title>Registro Exitoso</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDialogDismiss}>Ir al login</Button>
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
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
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
});
