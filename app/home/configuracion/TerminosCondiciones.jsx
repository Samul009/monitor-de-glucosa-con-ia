import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';

export default function TerminosCondiciones({ navigation }) {
  return (
    <View style={styles.fullScreen}>
      

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>Términos de Servicio</Text>
            <Text style={styles.paragraph}>
              Bienvenido a "Control de Glucosa". Al utilizar nuestra aplicación, usted acepta los siguientes términos y condiciones. Nos reservamos el derecho de modificar estos términos en cualquier momento. El uso continuado de la aplicación constituye su aceptación de dichos cambios.
            </Text>
            <Text style={styles.paragraph}>
              **1. Uso de la Aplicación:** La aplicación "Control de Glucosa" está diseñada para ayudarle a registrar y monitorear sus datos de salud. No debe considerarse un sustituto del consejo médico profesional. Siempre consulte a su médico antes de tomar decisiones sobre su salud.
            </Text>
            <Text style={styles.paragraph}>
              **2. Privacidad de Datos:** Respetamos su privacidad. Los datos que ingrese son almacenados localmente en su dispositivo para su seguridad y control. No compartimos sus datos con terceros. Para más detalles, consulte nuestra Política de Privacidad completa.
            </Text>
            <Text style={styles.paragraph}>
              **3. Limitación de Responsabilidad:** La aplicación se proporciona "tal cual". No garantizamos que el servicio sea ininterrumpido o libre de errores. No somos responsables de cualquier daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar la aplicación.
            </Text>
            <Text style={styles.paragraph}>
              **4. Propiedad Intelectual:** Todo el contenido de la aplicación, incluyendo textos, gráficos y software, es propiedad de "Control de Glucosa" y está protegido por las leyes de derechos de autor.
            </Text>
            <Text style={styles.paragraph}>
              **5. Modificación y Terminación:** Nos reservamos el derecho de modificar o discontinuar el servicio, o de terminar su acceso, en cualquier momento, con o sin previo aviso.
            </Text>
            <Text style={styles.paragraph}>
              Al hacer clic en "Aceptar", usted reconoce que ha leído y entendido estos términos.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
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
  scrollContainer: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  cardTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#009FDA',
    textAlign: 'center',
  },
  paragraph: {
    marginBottom: 15,
    lineHeight: 22,
    color: '#333',
    textAlign: 'justify',
  },
});
