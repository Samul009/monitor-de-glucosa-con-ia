import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  FlatList, 
  Keyboard, 
  Dimensions, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Animated
} from "react-native";
import {
  Text,
  TextInput,
  IconButton,
  ActivityIndicator,
  Card,
  Surface,
  Chip,
  Snackbar,
  Avatar,
} from "react-native-paper";
import { sendMessageToAI } from "../services/aiService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get("window");

export default function Analisis({ cambiarPantalla }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrosGlucosa, setRegistrosGlucosa] = useState([]);
  const [registrosAlimentacion, setRegistrosAlimentacion] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);
  const textInputRef = useRef(null);

  // Animación para el desplazamiento cuando aparece el teclado
  const keyboardOffset = useRef(new Animated.Value(0)).current;

  
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        const newKeyboardHeight = e.endCoordinates.height;
        setKeyboardHeight(newKeyboardHeight);
        
        Animated.timing(keyboardOffset, {
          duration: e.duration || 250,
          toValue: -newKeyboardHeight,
          useNativeDriver: true,
        }).start();
        
        
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      (e) => {
        Animated.timing(keyboardOffset, {
          duration: e.duration || 250,
          toValue: 0,
          useNativeDriver: true,
        }).start();
        
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Carga los registros desde AsyncStorage 
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [glucosaData, alimentacionData] = await Promise.all([
          AsyncStorage.getItem('registrosGlucosa'),
          AsyncStorage.getItem('registrosAlimentacion')
        ]);
        
        const registrosGlucosa = JSON.parse(glucosaData) || [];
        const registrosAlimentacion = JSON.parse(alimentacionData) || [];
        
        setRegistrosGlucosa(registrosGlucosa);
        setRegistrosAlimentacion(registrosAlimentacion);
        
        
        const mensajeBienvenida = registrosGlucosa.length > 0 
          ? `¡Hola! Veo que tienes ${registrosGlucosa.length} registros de glucosa y ${registrosAlimentacion.length} registros de alimentación. Estoy aquí para analizar tus datos y responder cualquier pregunta que tengas. ¿En qué puedo ayudarte hoy?`
          : '¡Hola! Estoy aquí para analizar tus datos y responder cualquier pregunta que tengas. Si quieres que analice tus registros, solo pregunta.';
        
        setMessages([{
          id: 'welcome-message',
          text: mensajeBienvenida,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }]);
      } catch (error) {
        console.error("Error al cargar los registros:", error);
        setSnackbarMessage('Error al cargar tus datos. Por favor, intenta de nuevo.');
        setSnackbarVisible(true);
      }
    };
    cargarDatos();
  }, []);

  const sugerenciasRapidas = [
    "Analiza mis niveles de glucosa",
    "¿Qué patrones ves en mis datos?",
    "Recomiéndame alimentos adecuados",
    "¿Cómo puedo mejorar mi control glucémico?",
    "Resume mi progreso esta semana"
  ];

  const handleSend = async (text = null) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    
    const userMessage = { 
      id: Date.now().toString(), 
      text: messageText, 
      sender: "user", 
      timestamp: new Date().toISOString() 
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (!text) setInput("");
    setLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    // Crea el prompt con los datos de salud para la IA
    const promptConDatos = `Eres un asistente de salud especializado en diabetes. Analiza la siguiente información y responde de manera clara, concisa y útil.

Datos de glucosa del usuario:
${JSON.stringify(registrosGlucosa.slice(-10), null, 2)}

Datos de alimentación del usuario:
${JSON.stringify(registrosAlimentacion.slice(-10), null, 2)}

Pregunta del usuario: "${userMessage.text}"

Responde de manera empática y profesional, enfocándote en ayudar al usuario a gestionar su condición.`;

    // Envía el prompt completo a la IA
    try {
      const aiResponse = await sendMessageToAI(promptConDatos);
      const aiMessage = {
        id: Date.now().toString() + "-ai",
        text: aiResponse,
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error al obtener respuesta de la IA:", error);
      const errorMessage = {
        id: Date.now().toString() + "-error",
        text: "Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo en un momento.",
        sender: "ai",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  const usarSugerencia = (sugerencia) => {
    handleSend(sugerencia);
  };

  const limpiarChat = () => {
    setMessages([{
      id: 'cleared-chat-message',
      text: '¡Hola de nuevo! ¿En qué puedo ayudarte hoy?',
      sender: 'ai',
      timestamp: new Date().toISOString()
    }]);
    setSnackbarMessage('Conversación reiniciada');
    setSnackbarVisible(true);
  };

  const renderItem = ({ item }) => (
    <View style={[
      styles.messageContainer, 
      item.sender === "user" ? styles.userContainer : styles.aiContainer
    ]}>
      {item.sender === "ai" && (
        <Avatar.Icon 
          size={32} 
          icon="robot" 
          style={styles.avatar} 
          color="#2E7D32"
        />
      )}
      
      <Card
        style={[
          styles.messageCard,
          item.sender === "user" ? styles.userMessage : styles.aiMessage,
        ]}
      >
        <Card.Content style={styles.cardContent}>
          <Text style={item.sender === "user" ? styles.userMessageText : styles.aiMessageText}>
            {item.text}
          </Text>
        </Card.Content>
      </Card>
      
      {item.sender === "user" && (
        <Avatar.Icon 
          size={32} 
          icon="account" 
          style={styles.avatar} 
          color="#1565C0"
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Contenedor principal para el chat y el input */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.innerContainer}>
          {/* Sugerencias rápidas */}
          {messages.length <= 1 && (
            <Surface style={styles.sugerenciasSurface} elevation={2}>
              <Text variant="titleSmall" style={styles.sugerenciasTitle}>
                Preguntas sugeridas
              </Text>
              <View style={styles.chipsContainer}>
                {sugerenciasRapidas.map((sugerencia, index) => (
                  <Chip
                    key={index}
                    mode="outlined"
                    onPress={() => usarSugerencia(sugerencia)}
                    style={styles.chip}
                    textStyle={styles.chipText}
                  >
                    {sugerencia}
                  </Chip>
                ))}
              </View>
            </Surface>
          )}

          {/* Área de mensajes de chat */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.chat}
            contentContainerStyle={styles.chatContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator animating={true} color="#2E7D32" size="small" />
                  <Text style={styles.loadingText}>Analizando tu consulta...</Text>
                </View>
              ) : null
            }
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
          />
        </View>
      </TouchableWithoutFeedback>

      
      <Animated.View 
        style={[
          styles.inputArea,
          { transform: [{ translateY: keyboardOffset }] }
        ]}
      >
        <Surface style={styles.inputSurface} elevation={4}>
          <View style={styles.inputWrapper}>
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder="Escribe tu mensaje o pregunta..."
              value={input}
              onChangeText={setInput}
              mode="outlined"
              multiline
              maxLength={500}
              numberOfLines={Math.min(5, Math.max(1, input.split('\n').length))}
              theme={{ 
                colors: { 
                  primary: "#2E7D32", 
                  background: "#FFFFFF",
                  placeholder: "#757575"
                } 
              }}
              disabled={loading}
              onSubmitEditing={() => {
                handleSend();
              }}
              returnKeyType="send"
              blurOnSubmit={false}
            />
            <IconButton
              icon="send"
              size={24}
              onPress={() => handleSend()}
              color={input.trim() && !loading ? '#2E7D32' : '#BDBDBD'}
              disabled={!input.trim() || loading}
              style={styles.sendButton}
            />
          </View>
          <Text variant="bodySmall" style={styles.charCount}>
            {input.length}/500
          </Text>
        </Surface>
      </Animated.View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackbarVisible(false),
        }}
        style={[styles.snackbar, { marginBottom: keyboardHeight + 20 }]}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  innerContainer: {
    flex: 1,
  },
  chat: {
    flex: 1,
    marginBottom: 80,
  },
  sugerenciasSurface: {
    padding: 16,
    margin: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  sugerenciasTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2E7D32',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  chipText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  chatContent: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    paddingBottom: 100, 
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    maxWidth: '100%',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    marginHorizontal: 8,
    backgroundColor: 'transparent',
  },
  messageCard: {
    padding: 2,
    borderRadius: 18,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: "#2E7D32",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardContent: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  userMessageText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 20,
  },
  aiMessageText: {
    color: "#212121",
    fontSize: 15,
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  loadingText: {
    marginLeft: 12,
    color: "#616161",
    fontSize: 14,
  },
  inputArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  inputSurface: {
    padding: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    marginRight: -10,
  },
  charCount: {
    textAlign: 'right',
    color: '#9E9E9E',
    marginTop: 4,
  },
  snackbar: {
    backgroundColor: '#323232',
  },
});