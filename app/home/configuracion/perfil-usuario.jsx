import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Appbar, TextInput, Button, Card, Text, HelperText, ActivityIndicator } from 'react-native-paper';
import { getUser, saveUser } from '../../data/userStorage';


export default function PerfilUsuario({ cambiarPantalla }) {
  const [usuario, setUsuario] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUsuario = async () => {
      setLoading(true);
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUsuario(storedUser);
        }
      } catch (error) {
        console.log('Error cargando usuario:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!usuario.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
    if (!usuario.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido.';
    } else if (!/\S+@\S+\.\S+/.test(usuario.email)) {
      newErrors.email = 'El formato del correo es inválido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validate()) {
      setLoading(true);
      try {
        await saveUser(usuario);
        Alert.alert('Éxito', 'Información de perfil actualizada.');
        setIsEditing(false);
      } catch (error) {
        console.log('Error guardando usuario:', error);
        Alert.alert('Error', 'No se pudo guardar la información.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreen}>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Datos del Perfil</Text>
            
            <TextInput
              label="Nombre completo"
              value={usuario.nombre}
              onChangeText={(text) => setUsuario({ ...usuario, nombre: text })}
              mode="outlined"
              style={styles.input}
              disabled={!isEditing}
              error={!!errors.nombre}
            />
            <HelperText type="error" visible={!!errors.nombre}>
              {errors.nombre}
            </HelperText>

            <TextInput
              label="Correo electrónico"
              value={usuario.email}
              onChangeText={(text) => setUsuario({ ...usuario, email: text })}
              mode="outlined"
              style={styles.input}
              disabled={!isEditing}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            

            {isEditing ? (
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                loading={loading}
              >
                Guardar cambios
              </Button>
            ) : (
              <Button
                mode="contained"
                onPress={() => setIsEditing(true)}
                style={styles.button}
              >
                Editar
              </Button>
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  input: {
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#009FDA',
  },
});
