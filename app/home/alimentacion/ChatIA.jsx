import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Avatar, Badge, Chip, Dialog, Portal, Snackbar, Surface, FAB, SegmentedButtons, Switch } from 'react-native-paper';
import { sendMessageToAI } from '../../services/aiService';

export default function ChatIA() {
  const [chatMode, setChatMode] = useState('general');
  const [enableVoice, setEnableVoice] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const scrollViewRef = useRef(null);
  const suggestedQuestions = [
    '¿Qué alimentos son buenos para la diabetes?',
    '¿Cómo controlar mi glucosa?',
    'Recomiéndame una dieta saludable',
    '¿Qué ejercicios son adecuados para mí?'
  ];

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );
    
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: chatMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setConversation(prev => [...prev, userMessage]);
    setChatMessage('');
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI(chatMessage, conversation, chatMode);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setSnackbarMessage('Error al conectar con la IA: ' + error.message);
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionPress = (question) => {
    setChatMessage(question);
  };

  const renderMessage = (message) => {
    const isUser = message.sender === 'user';
    
    return (
      <View 
        key={message.id} 
        style={[
          styles.messageContainer,
          isUser ? styles.userMessage : styles.aiMessage
        ]}
      >
        {!isUser && (
          <Avatar.Icon 
            size={32} 
            icon="robot" 
            style={styles.avatar}
            color="#009FDA"
          />
        )}
        
        <Surface style={[
          styles.messageSurface,
          isUser ? styles.userSurface : styles.aiSurface
        ]}>
          <View style={styles.messageHeader}>
            <Text variant="labelSmall" style={[
              styles.senderText,
              isUser ? styles.userText : styles.aiText
            ]}>
              {isUser ? 'Tú' : 'Asistente IA'}
            </Text>
            
            {!isUser && (
              <Badge size={8} style={styles.onlineBadge} />
            )}
            
            <Text variant="bodySmall" style={styles.timeText}>
              {message.timestamp.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          
          <Text style={[
            styles.messageText,
            isUser ? styles.userText : styles.aiText
          ]}>
            {message.text}
          </Text>
          
          <View style={styles.messageActions}>
            {!isUser && (
              <>
                <Button 
                  icon="thumb-up" 
                  size="small" 
                  mode="text"
                  onPress={() => {
                    setSnackbarMessage('¡Feedback positivo enviado!');
                    setSnackbarVisible(true);
                  }}
                >
                  Útil
                </Button>
                <Button 
                  icon="thumb-down" 
                  size="small" 
                  mode="text"
                  onPress={() => {
                    setSnackbarMessage('Feedback enviado para mejorar');
                    setSnackbarVisible(true);
                  }}
                >
                  No útil
                </Button>
              </>
            )}
          </View>
        </Surface>
        
        {isUser && (
          <Avatar.Icon 
            size={32} 
            icon="account" 
            style={styles.avatar}
            color="#ffffff"
            backgroundColor="#009FDA"
          />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.fullScreen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <View style={styles.mainContent}>
        
        <Surface style={styles.controlsSurface} elevation={2}>
          <View style={styles.controlsRow}>
            <SegmentedButtons
              value={chatMode}
              onValueChange={setChatMode}
              buttons={[
                { value: 'general', label: 'General', icon: 'chat' },
                { value: 'nutrition', label: 'Nutrición', icon: 'food' },
                { value: 'glucose', label: 'Glucosa', icon: 'needle' },
              ]}
              style={styles.segmentedButtons}
            />
            
            <View style={styles.switchContainer}>
              <Text variant="bodySmall">Voz</Text>
              <Switch value={enableVoice} onValueChange={setEnableVoice} />
            </View>
          </View>
        </Surface>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.suggestionsScroll}
          contentContainerStyle={styles.suggestionsContainer}
        >
          {suggestedQuestions.map((question, index) => (
            <Chip
              key={index}
              icon="lightbulb-on"
              onPress={() => handleSuggestionPress(question)}
              style={styles.suggestionChip}
              textStyle={styles.suggestionText}
            >
              {question}
            </Chip>
          ))}
        </ScrollView>

        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.conversationContainer}
          style={styles.conversationScroll}
          showsVerticalScrollIndicator={false}
        >
          {conversation.map(renderMessage)}
          
          {loading && (
            <View style={styles.typingContainer}>
              <ActivityIndicator size="small" color="#009FDA" />
              <Text variant="bodySmall" style={styles.typingText}>
                IA está escribiendo...
              </Text>
            </View>
          )}
        </ScrollView>

        <Surface style={[
          styles.inputSurface, 
          keyboardVisible && styles.inputSurfaceWithKeyboard
        ]} elevation={4}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Escribe tu pregunta..."
              value={chatMessage}
              onChangeText={setChatMessage}
              style={styles.input}
              multiline
              maxLength={500}
              right={
                <TextInput.Icon 
                  icon={enableVoice ? "microphone" : "microphone-off"} 
                  onPress={() => setEnableVoice(!enableVoice)}
                />
              }
            />
            <FAB
              icon="send"
              onPress={handleSendMessage}
              disabled={!chatMessage.trim() || loading}
              style={styles.sendFab}
              size="small"
            />
          </View>
          
          <View style={styles.inputFooter}>
            <Text variant="bodySmall" style={styles.charCount}>
              {chatMessage.length}/500
            </Text>
            <Button 
              mode="text" 
              onPress={() => setChatMessage('')}
              disabled={!chatMessage}
            >
              Limpiar
            </Button>
          </View>
        </Surface>
      </View>

      <Portal>
        <Dialog visible={showHelpDialog} onDismiss={() => setShowHelpDialog(false)}>
          <Dialog.Icon icon="robot" />
          <Dialog.Title>Asistente IA de Salud</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Puedo ayudarte con:
              {"\n\n"}
              • 🍎 Nutrición y dietas
              {"\n"}
              • 🩸 Control de glucosa
              {"\n"}
              • 💪 Ejercicios y actividad física
              {"\n"}
              • 📊 Interpretación de resultados
              {"\n"}
              • 🍽️ Recetas saludables
              {"\n\n"}
              ¡Hazme cualquier pregunta!
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowHelpDialog(false)}>Entendido</Button>
          </Dialog.Actions>
        </Dialog>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          action={{
            label: 'OK',
            onPress: () => setSnackbarVisible(false),
          }}
          style={styles.snackbar}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fullScreen: { 
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
  controlsSurface: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  segmentedButtons: {
    flex: 1,
    marginRight: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  suggestionsScroll: {
    marginBottom: 12,
    maxHeight: 60,
  },
  suggestionsContainer: {
    paddingHorizontal: 4,
  },
  suggestionChip: {
    marginHorizontal: 4,
    backgroundColor: '#e3f2fd',
  },
  suggestionText: {
    fontSize: 12,
  },
  conversationScroll: {
    flex: 1,
    marginBottom: 12,
  },
  conversationContainer: {
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  avatar: {
    backgroundColor: 'transparent',
    marginTop: 4,
  },
  messageSurface: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userSurface: {
    backgroundColor: '#009FDA',
    borderTopRightRadius: 4,
  },
  aiSurface: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  senderText: {
    fontWeight: 'bold',
  },
  onlineBadge: {
    backgroundColor: '#4caf50',
  },
  timeText: {
    color: '#666',
    marginLeft: 'auto',
  },
  messageText: {
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#333333',
  },
  messageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: '#666',
  },
  inputSurface: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 0,
  },
  inputSurfaceWithKeyboard: {
    marginBottom: Platform.OS === 'ios' ? 300 : 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    maxHeight: 100,
  },
  sendFab: {
    backgroundColor: '#009FDA',
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  charCount: {
    color: '#666',
  },
  snackbar: {
    backgroundColor: '#323232',
  },
});