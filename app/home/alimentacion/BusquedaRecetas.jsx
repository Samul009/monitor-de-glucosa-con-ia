import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { 
  Text, 
  TextInput, 
  Button, 
  Card, 
  ActivityIndicator, 
  Appbar, 
  Searchbar, 
  Chip, 
  IconButton, 
  Surface,
  Snackbar,
  List
} from 'react-native-paper';
import { sendMessageToAI } from '../../services/aiService';

export default function BusquedaRecetas({ onRecipePress, onCancel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const popularIngredients = [
    'Pollo', 'Pescado', 'Verduras', 'Avena', 'Lentejas', 
    'Quinoa', 'Huevos', 'Tofu', 'Brócoli', 'Espinacas'
  ];

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setSnackbarMessage('Por favor, ingresa un ingrediente para buscar');
      setSnackbarVisible(true);
      return;
    }
    
    setLoading(true);
    setSearchResults([]);
    
    try {
      const prompt = `Genera un array de 3 a 5 objetos JSON de recetas para una persona con diabetes basadas en el ingrediente: "${searchQuery}". Cada objeto debe tener un "titulo", una "sugerencia_completa" (con la preparación de la receta en pasos fáciles de entender para una persona corriente), y un "emoji". El formato de la respuesta debe ser solo el array JSON.`;
      
      const respuesta = await sendMessageToAI(prompt);
      const jsonRegex = /\[[\s\S]*\]/;
      const match = respuesta.match(jsonRegex);

      if (match) {
        const parsedResults = JSON.parse(match[0]);
        setSearchResults(parsedResults);
      } else {
        throw new Error("No se pudo extraer el JSON de la respuesta de la IA.");
      }
    } catch (error) {
      console.error("Error al buscar recetas:", error);
      setSearchResults([]);
      setSnackbarMessage("Hubo un problema al generar las recetas. Por favor, intenta de nuevo.");
      setSnackbarVisible(true);
    }
    setLoading(false);
  };

  const handleIngredientSelect = (ingredient) => {
    setSearchQuery(ingredient);
  };

  return (
    <View style={styles.contentContainer}>
      

      <View style={styles.scrollView}>
        <Surface style={styles.surface} elevation={2}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Encuentra recetas saludables
          </Text>
          
          <Searchbar
            placeholder="Ej: Pollo a la plancha con verduras"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchBar}
            onSubmitEditing={handleSearch}
          />
          
          <Text variant="bodyMedium" style={styles.chipsTitle}>
            Ingredientes populares:
          </Text>
          
          <View style={styles.chipsContainer}>
            {popularIngredients.map((ingredient, index) => (
              <Chip
                key={index}
                mode="outlined"
                onPress={() => handleIngredientSelect(ingredient)}
                style={styles.chip}
                compact
              >
                {ingredient}
              </Chip>
            ))}
          </View>
          
          <View style={styles.formButtons}>
            <Button 
              mode="contained" 
              onPress={handleSearch}
              style={styles.formButton}
              icon="magnify"
              loading={loading}
              disabled={loading}
            >
              Buscar Recetas
            </Button>
            <Button 
              mode="outlined" 
              onPress={onCancel}
              style={styles.formButton}
              icon="arrow-left"
              disabled={loading}
            >
              Volver
            </Button>
          </View>
        </Surface>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text variant="bodyMedium" style={styles.loadingText}>
              Generando recetas saludables...
            </Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text variant="titleMedium" style={styles.resultsTitle}>
              Recetas encontradas ({searchResults.length})
            </Text>
            
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Card 
                  style={styles.card} 
                  onPress={() => onRecipePress(item)}
                  mode="elevated"
                >
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <Text variant="titleMedium" style={styles.cardTitle}>
                        {item.emoji || '🍽'} {item.titulo || "Receta sin título"}
                      </Text>
                      <IconButton
                        icon="chevron-right"
                        size={20}
                        onPress={() => onRecipePress(item)}
                      />
                    </View>
                    <Text 
                      variant="bodyMedium" 
                      style={styles.cardContent}
                      numberOfLines={3}
                    >
                      {item.sugerencia_completa || "No hay más información."}
                    </Text>
                  </Card.Content>
                </Card>
              )}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        ) : (
          <Surface style={styles.placeholderSurface} elevation={1}>
            <Text variant="bodyMedium" style={styles.placeholderText}>
              Ingresa un ingrediente o selecciona uno de los populares para descubrir recetas saludables para personas con diabetes.
            </Text>
          </Surface>
        )}
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: { 
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  surface: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    color: '#2E7D32', 
    marginBottom: 16,
    textAlign: 'center'
  },
  searchBar: {
    marginBottom: 16,
  },
  chipsTitle: {
    marginBottom: 8,
    color: '#666',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  input: { 
    marginBottom: 15 
  },
  formButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 12,
  },
  formButton: { 
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  cardContent: {
    color: '#666',
    lineHeight: 20,
  },
  placeholderSurface: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
});