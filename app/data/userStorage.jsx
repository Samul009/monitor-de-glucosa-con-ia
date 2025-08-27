// userStorage.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar datos 
export const saveUser = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('@user', jsonValue);
  } catch (e) {
    console.error('Error guardando usuario:', e);
  }
};

// Obtener datos 
export const getUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error obteniendo usuario:', e);
    return null;
  }
};

// Eliminar datos
export const clearUser = async () => {
  try {
    await AsyncStorage.removeItem('@user');
  } catch (e) {
    console.error('Error limpiando usuario:', e);
  }
};
