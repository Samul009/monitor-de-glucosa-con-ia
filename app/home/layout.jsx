import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { Provider as PaperProvider, BottomNavigation, Appbar, Drawer as PaperDrawer,Portal,Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Inicio from './pantalla-principal';
import Servicios from './servicios';
import Alimentacion from './alimentacion/alimentacion';
import RecetaDetallada from './alimentacion/detalle-receta';
import Configuracion from './configuracion/configuration';
import PerfilUsuario from './configuracion/perfil-usuario';
import GlucosaPrincipal from './glucosa/GlucosaPrincipal';
import Generarinformes from './GenerarInformes';
import iaanalisis from './ia-analisis';
import notificaciones from './configuracion/notificaciones';
import privacidad from './configuracion/privacidad';
import acerca from './configuracion/acerca';
import CambiarPassword from './configuracion/CambiarPassword';
import GestionDatos from './configuracion/GestionDatos';
import HistorialSesiones from './configuracion/HistorialSesiones';
import TerminosCondiciones from './configuracion/TerminosCondiciones';


const pantallas = [
  { title: 'Inicio', icon: 'home', component: Inicio, enMenu: true, enDrawer: true },
  { title: 'Servicios', icon: 'format-list-bulleted', component: Servicios, enMenu: true, enDrawer: false },
  { title: 'Alimentacion', icon: 'food-apple', component: Alimentacion, enMenu: false, enDrawer: false },
  { title: 'Estadisticas', icon: '', component: GlucosaPrincipal, enMenu: false, enDrawer: false },
  { title: 'RecetaDetallada', icon: 'food-apple', component: RecetaDetallada, enMenu: false, enDrawer: false },
  { title: 'Configuración', icon: 'cog', component: Configuracion, enMenu: false, enDrawer: true },
  { title: 'Perfil de Usuario', icon: 'account', component: PerfilUsuario, enMenu: false, enDrawer: true },
  { title: 'Informes', icon: 'file-chart', component: Generarinformes, enMenu: false, enDrawer: false },
  { title: 'IA Analisis', icon: 'robot', component: iaanalisis, enMenu: false, enDrawer: false },
  { title: 'Notificaciones', icon: 'bell', component: notificaciones, enMenu: false, enDrawer: true },
  { title: 'Privacidad', icon: 'shield-lock', component: privacidad, enMenu: false, enDrawer: true },
  { title: 'Acerca de', icon: 'information', component: acerca, enMenu: false, enDrawer: true },
  { title: 'Cambiar Contraseña', icon: 'lock-reset', component: CambiarPassword, enMenu: false, enDrawer: false },
  { title: 'Gestion de Datos', icon: 'database', component: GestionDatos, enMenu: false, enDrawer: false },
  { title: 'Historial de Sesiones', icon: 'history', component: HistorialSesiones, enMenu: false, enDrawer: false },
  { title: 'Terminos y Condiciones', icon: 'file-document-outline', component: TerminosCondiciones, enMenu: false, enDrawer: false }
];

export default function HomeLayout({ onLogout }) {
  const [pantallaActual, setPantallaActual] = useState('Inicio');
  const [recetaData, setRecetaData] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  
  // useRef para mantener el historial que persiste 
  const historialRef = useRef(['Inicio']);

  // Pantallas del menú inferior
  const pantallasMenu = pantallas.filter(p => p.enMenu);
  
  // Pantallas del drawer
  const pantallasDrawer = pantallas.filter(p => p.enDrawer);

  const cambiarPantalla = useCallback((nombrePantalla) => {
    if (nombrePantalla === 'Login') {
      onLogout();
    } else {
      historialRef.current.push(nombrePantalla);
      setPantallaActual(nombrePantalla);
      setRecetaData(null);
      setDrawerVisible(false);
    }
  }, [onLogout]);

  const navegarAReceta = useCallback((receta) => {
    historialRef.current.push('RecetaDetallada');
    setRecetaData({ 
      sugerencia: receta.sugerencia_completa, 
      titulo: receta.titulo 
    });
    setPantallaActual('RecetaDetallada');
  }, []);


  const volver = useCallback(() => {
    if (historialRef.current.length > 1) {
      
      historialRef.current.pop();
      
     
      const pantallaAnterior = historialRef.current[historialRef.current.length - 1];
      
      
      setPantallaActual(pantallaAnterior);
      setRecetaData(null);
    } else {
      
      setPantallaActual('Inicio');
    }
  }, []);


  const deberiaMostrarBotonAtras = useCallback(() => {
    return historialRef.current.length > 1 && 
           pantallaActual !== 'Inicio' && 
           pantallaActual !== 'Servicios';
  }, [pantallaActual]);

  const toggleDrawer = useCallback(() => {
    setDrawerVisible(!drawerVisible);
  }, [drawerVisible]);

  // Renderizar contenido de pantalla
  const renderizarContenido = () => {
    const pantalla = pantallas.find(p => p.title === pantallaActual);
    if (!pantalla) return null;

    const Componente = pantalla.component;

    if (pantallaActual === 'RecetaDetallada') {
      return (
        <Componente
          sugerencia={recetaData?.sugerencia}
          titulo={recetaData?.titulo}
          cambiarPantalla={cambiarPantalla}
          goBack={volver}
        />
      );
    }

    return (
      <Componente
        cambiarPantalla={cambiarPantalla}
        navegarAReceta={navegarAReceta}
        goBack={volver}
      />
    );
  };


  const obtenerIndiceMenu = () => {
    const indice = pantallasMenu.findIndex(p => p.title === pantallaActual);
    return indice >= 0 ? indice : 0;
  };

  // Renderizar Drawer
  const renderDrawer = () => (
    <View style={styles.drawerContent}>
      <PaperDrawer.Section title="Navegación Principal">
        {pantallasDrawer.map((pantalla) => (
          <PaperDrawer.Item
            key={pantalla.title}
            label={pantalla.title}
            icon={pantalla.icon}
            active={pantallaActual === pantalla.title}
            onPress={() => cambiarPantalla(pantalla.title)}
          />
        ))}
      </PaperDrawer.Section>
      
      
    </View>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        
       
        <Appbar.Header style={styles.appbar}>
          <Appbar.Action 
            icon="menu" 
            onPress={toggleDrawer}
          />
          
          {/* Mostrar botón de retroceso solo cuando hay historial */}
          {deberiaMostrarBotonAtras() && (
            <Appbar.BackAction onPress={volver} />
          )}
          
          <Appbar.Content title={pantallaActual} />
          
      
          {pantallaActual !== 'Configuración' && (
            <Appbar.Action 
              icon="cog" 
              onPress={() => cambiarPantalla('Configuración')} 
            />
          )}
        </Appbar.Header>

        {/* Drawer Modal */}
        <Portal>
          <Modal
            visible={drawerVisible}
            onDismiss={() => setDrawerVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <View style={styles.drawer}>
              {renderDrawer()}
            </View>
            <View 
              style={styles.drawerOverlay} 
              onTouchEnd={() => setDrawerVisible(false)}
            />
          </Modal>
        </Portal>

        {/* BottomNavigation */}
        <BottomNavigation
          navigationState={{
            index: obtenerIndiceMenu(),
            routes: pantallasMenu.map(p => ({
              key: p.title,
              title: p.title,
              focusedIcon: p.icon
            }))
          }}
          onIndexChange={(nuevoIndice) => {
            cambiarPantalla(pantallasMenu[nuevoIndice].title);
          }}
          renderScene={() => (
            <View style={styles.contenidoPantalla}>
              {renderizarContenido()}
            </View>
          )}
          renderIcon={({ route, color }) => (
            <MaterialCommunityIcons 
              name={route.focusedIcon} 
              size={24} 
              color={color} 
            />
          )}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contenidoPantalla: {
    flex: 1,
  },
  appbar: {
    backgroundColor: '#009FDA',
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    width: 280,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});