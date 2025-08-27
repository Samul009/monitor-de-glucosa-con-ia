import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, RefreshControl, FlatList } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { sendMessageToAI } from '../../services/aiService';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FeedAlimentacion({ onRecipePress, cambiarPantalla }) {
  const [aiFeed, setAiFeed] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const obtenerFeedIA = async () => {
    setLoading(true);
    try {
      const prompt = `Actúa como un dietista experto en diabetes. Genera un array de 5 objetos JSON. Cada objeto debe tener un "título" (máx. 8 palabras), una "descripción" (máx. 25 palabras), una "sugerencia_completa" (un párrafo corto) y un "emoji" que represente el contenido. El contenido debe ser sobre nutrición para personas con diabetes, ideas de recetas, o consejos de salud. El formato de la respuesta debe ser solo el array JSON, sin texto o explicaciones adicionales.`;
      
      const respuesta = await sendMessageToAI(prompt);
      
      const jsonRegex = /\[[\s\S]*\]/;
      const match = respuesta.match(jsonRegex);
      
      if (match) {
        const parsedFeed = JSON.parse(match[0]);
        setAiFeed(parsedFeed);
      } else {
        throw new Error("No se pudo extraer el JSON de la respuesta de la IA.");
      }
    } catch (error) {
      console.error(error);
      setAiFeed([]);
    }
    setLoading(false);
  };
  
  useEffect(() => {
    if (isFocused) {
      obtenerFeedIA();
    }
  }, [isFocused]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    obtenerFeedIA().finally(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.feedContainer}>
      <Card style={styles.recipeLinkCard} onPress={() => cambiarPantalla('Recetas del Día')}>
        <Card.Content style={styles.recipeLinkContent}>
          <MaterialCommunityIcons name="silverware-fork-knife" size={24} color="#009FDA" />
          <Text style={styles.recipeLinkText}>Ver Recetas del Día</Text>
        </Card.Content>
      </Card>

      {loading && !refreshing ? <ActivityIndicator size="large" style={{ marginTop: 20 }} /> : null}
      
      {aiFeed.length > 0 ? (
        <FlatList
          data={aiFeed}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Card style={styles.card} onPress={() => onRecipePress(item)}>
              <Card.Title
                title={`${item.emoji || '💡'} ${item.título || "Sin título"}`}
                subtitle={item.descripción || "Sin descripción"}
                titleStyle={styles.cardTitle}
                subtitleStyle={styles.cardSubtitle}
              />
              <Card.Content>
                <Text>{item.sugerencia_completa || "No hay más información."}</Text>
              </Card.Content>
            </Card>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        !loading && <Text style={{ textAlign: 'center', color: '#777', marginTop: 20 }}>
          No se pudo obtener el feed. Desliza hacia abajo para intentar de nuevo.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  feedContainer: { flex: 1 },
  card: { marginTop: 10, padding: 10, backgroundColor: '#fff', borderRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 14, color: '#666' },
  recipeLinkCard: { marginTop: 10, elevation: 2, backgroundColor: '#e6f7ff' },
  recipeLinkContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15 },
  recipeLinkText: { marginLeft: 10, fontWeight: 'bold', color: '#007ACC' },
});