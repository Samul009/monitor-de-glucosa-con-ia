import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { FAB, Appbar } from 'react-native-paper';
import RegistroComida from './RegistroComida';
import ChatIA from './ChatIA';
import BusquedaRecetas from './BusquedaRecetas';
import FeedAlimentacion from './FeedAlimentacion';

export default function Alimentacion(props) {
  const [currentView, setCurrentView] = useState('feed');
  const [fabOpen, setFabOpen] = useState(false);

  const handlePressCard = (item) => {
    props.navegarAReceta(item);
  };

  const getTitle = () => {
    switch (currentView) {
      case 'form': return 'Registrar Comida';
      case 'chat': return 'Chat con IA';
      case 'search': return 'Buscar Recetas';
      case 'feed':
      default: return 'Alimentación';
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'form':
        return <RegistroComida onCancel={() => setCurrentView('feed')} onSave={() => setCurrentView('feed')} />;
      case 'chat':
        return <ChatIA />;
      case 'search':
        return <BusquedaRecetas onRecipePress={handlePressCard} onCancel={() => setCurrentView('feed')} />;
      case 'feed':
      default:
        return <FeedAlimentacion onRecipePress={handlePressCard} cambiarPantalla={props.cambiarPantalla} />;
    }
  };

  const fabActions = [
    {
      icon: 'plus',
      label: 'Registrar comida',
      onPress: () => setCurrentView('form'),
    },
    {
      icon: 'chat',
      label: 'Chat con IA',
      onPress: () => setCurrentView('chat'),
    },
    {
      icon: 'magnify',
      label: 'Buscar recetas',
      onPress: () => setCurrentView('search'),
    },
  ];

  const handleBack = () => {
    if (currentView !== 'feed') {
      setCurrentView('feed');
    } else {
      props.cambiarPantalla('Servicios');
    }
  };

  return (
    <View style={styles.fullScreen}>
      

      <View style={styles.contentWrapper}>
        {renderContent()}
      </View>

      <FAB.Group
        open={fabOpen}
        icon={fabOpen ? 'close' : 'plus'}
        actions={fabActions}
        onStateChange={({ open }) => setFabOpen(open)}
        onPress={() => fabOpen && setFabOpen(false)}
        style={styles.fabGroup}
        fabStyle={styles.mainFab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  appbar: { 
    backgroundColor: '#009FDA' 
  },
  contentWrapper: { 
    flex: 1
  },
  fabGroup: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
  mainFab: {
    backgroundColor: '#009FDA',
  },
});