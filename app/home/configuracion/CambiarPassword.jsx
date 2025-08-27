import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, Button, Card, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUser, getUser } from '../../data/userStorage';
import usuarios from '../../data/usuario.json';


export default function CambiarPassword({ cambiarPantalla }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = async () => {
   
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'La nueva contraseña y la confirmación no coinciden.');
      return;
    }

   
    const currentUser = await getUser();
    if (!currentUser) {
      Alert.alert('Error', 'No se encontró el usuario. Por favor, vuelva a iniciar sesión.');
      return;
    }

    const userInDb = usuarios.find(u => u.email === currentUser.email);


    if (userInDb && userInDb.password !== currentPassword) {
      Alert.alert('Error', 'La contraseña actual es incorrecta.');
      return;
    }

    const updatedUser = { ...currentUser, password: newPassword };

   
    const userIndex = usuarios.findIndex(u => u.email === updatedUser.email);
    if (userIndex !== -1) {
      usuarios[userIndex].password = newPassword;
    }

    await saveUser(updatedUser);

    Alert.alert('Éxito', 'Tu contraseña ha sido actualizada correctamente.', [
      {
        text: 'OK',
        onPress: () => {
          
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          
          cambiarPantalla('Inicio');
        }
      }
    ]);
  };

  const handleForgotPassword = () => {
    Alert.alert(
      '¿Olvidaste tu contraseña?',
      'Esta función no está implementada en esta demo. Por favor, contacta a soporte técnico para asistencia.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.fullScreen}>
     

      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Actualizar Contraseña</Text>
            <TextInput
              label="Contraseña Actual"
              mode="outlined"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              style={styles.input}
            />
            <TextInput
              label="Nueva Contraseña"
              mode="outlined"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              style={styles.input}
            />
            <TextInput
              label="Confirmar Nueva Contraseña"
              mode="outlined"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
            >
              Cambiar Contraseña
            </Button>
            <Button
              mode="text"
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
              labelStyle={styles.forgotPasswordButtonText}
            >
              Olvidé mi contraseña
            </Button>
          </Card.Content>
        </Card>
      </View>
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
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#009FDA',
  },
  forgotPasswordButton: {
    marginTop: 10,
  },
  forgotPasswordButtonText: {
    color: '#009FDA',
  },
});
