import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Share, Dimensions, 
  TouchableOpacity,
  Modal
} from 'react-native';
import { Button, ActivityIndicator, Card, Text, Surface, 
  Chip,
  TouchableRipple,
  Divider 
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');
const timeframes = [
  { label: 'Hoy', days: 0, icon: 'calendar-today' },
  { label: '7 días', days: 7, icon: 'calendar-week' },
  { label: '30 días', days: 30, icon: 'calendar-month' },
  { label: '3 meses', days: 90, icon: 'calendar-range' },
  { label: '1 año', days: 365, icon: 'calendar-star' },
  { label: 'Todo', days: 'todo', icon: 'calendar-text' },
];

export default function GenerarInforme({ cambiarPantalla }) {
  const [loading, setLoading] = useState(false);
  const [reporte, setReporte] = useState('');
  const [reporteHTML, setReporteHTML] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reportType, setReportType] = useState('unified');
  const [registros, setRegistros] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    cargarRegistros();
  }, []);

  const cargarRegistros = async () => {
    try {
      const registrosGuardados = JSON.parse(await AsyncStorage.getItem('registrosSalud')) || [];
      setRegistros(registrosGuardados);
    } catch (error) {
      console.error("Error al cargar los registros:", error);
      mostrarSnackbar("No se pudieron cargar los datos de salud.");
    }
  };

  const mostrarSnackbar = (mensaje) => {
    setSnackbarMessage(mensaje);
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000);
  };

  const generarInforme = async (dias, label) => {
    setLoading(true);
    setReporte('');
    setReporteHTML('');
    setSelectedTimeframe(label);

    try {
      let registrosFiltrados = [];
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (dias === 'todo') {
        registrosFiltrados = registros;
      } else if (dias === 0) {
        const fechaHoyString = hoy.toISOString().split('T')[0];
        registrosFiltrados = registros.filter(reg => reg.fecha === fechaHoyString);
      } else {
        const fechaInicio = new Date(hoy);
        fechaInicio.setDate(hoy.getDate() - dias);
        registrosFiltrados = registros.filter(reg => {
          const fechaRegistro = new Date(reg.fecha);
          return fechaRegistro >= fechaInicio && fechaRegistro <= hoy;
        }).sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      }

      if (registrosFiltrados.length === 0) {
        mostrarSnackbar("No hay datos para el período seleccionado");
        return;
      }

      const html = generarHtmlReporte(registrosFiltrados, reportType);
      setReporteHTML(html);
      setReporte(`Informe de ${label} generado ✓`);
      setDialogVisible(true);
    } catch (error) {
      console.error("Error al generar el informe:", error);
      mostrarSnackbar("Error al generar el informe");
    } finally {
      setLoading(false);
    }
  };

  const buscarPorFecha = async () => {
    setLoading(true);
    setReporte('');
    setReporteHTML('');
    setSelectedTimeframe('Fecha específica');

    try {
      const fechaSeleccionadaString = selectedDate.toISOString().split('T')[0];
      const registroDelDia = registros.filter(reg => reg.fecha === fechaSeleccionadaString);

      if (registroDelDia.length === 0) {
        mostrarSnackbar(`No hay datos para ${fechaSeleccionadaString}`);
        return;
      }

      const html = generarHtmlReporte(registroDelDia, reportType);
      setReporteHTML(html);
      setReporte(`Informe del ${fechaSeleccionadaString} generado ✓`);
      setDialogVisible(true);
    } catch (error) {
      console.error("Error al buscar por fecha:", error);
      mostrarSnackbar("Error al buscar por fecha");
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setSelectedDate(selectedDate);
  };

  const generarHtmlReporte = (datos, tipo) => {
    let html = `<!DOCTYPE html><html><head><title>Informe de Salud</title><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;padding:20px;color:#333;background-color:#f8f9fa}h1,h2,h3{color:#009FDA;text-align:center}table{width:100%;border-collapse:collapse;margin-top:20px;box-shadow:0 4px 6px rgba(0,0,0,0.1);border-radius:8px;overflow:hidden}th,td{padding:12px 15px;text-align:left;border-bottom:1px solid #ddd}th{background-color:#009FDA;color:white;font-weight:bold}tr:nth-child(even){background-color:#f2f2f2}.section{margin-top:30px}.entry{border-left:5px solid #009FDA;padding-left:15px;margin-bottom:20px}.entry-date{font-weight:bold;font-size:18px;margin-bottom:10px;color:#009FDA}.summary{background-color:#e8f4f8;padding:15px;border-radius:8px;margin:20px 0}.summary-title{font-weight:bold;color:#009FDA;margin-bottom:10px}@media print{body{padding:0;background-color:white}.no-print{display:none}}</style></head><body><h1>📊 Informe de Salud</h1><h2>${selectedTimeframe}</h2><p><strong>Generado el:</strong> ${new Date().toLocaleDateString()}</p><p><strong>Total de registros:</strong> ${datos.length}</p><div class="summary"><div class="summary-title">📈 Resumen Estadístico</div><p><strong>Período:</strong> ${datos.length > 0 ? datos[0].fecha + ' a ' + datos[datos.length - 1].fecha : 'N/A'}</p><p><strong>Días con registros:</strong> ${new Set(datos.map(d => d.fecha)).size}</p></div>`;
    
    if (tipo === 'unified') {
      html += `<h3>📋 Resumen Unificado</h3><table><thead><tr><th>📅 Fecha</th><th>🩸 Glucosa</th><th>❤️ Tensión</th><th>🏃 Actividad</th><th>💊 Medicación</th></tr></thead><tbody>`;
      datos.forEach(reg => {
        const glucosaAyunas = reg.glucosa?.ayunas?.valor ? `${reg.glucosa.ayunas.valor} mg/dL` : 'N/A';
        const tensionAM = reg.tensionArterial?.AM?.sistolica ? `${reg.tensionArterial.AM.sistolica}/${reg.tensionArterial.AM.diastolica}` : 'N/A';
        html += `<tr><td>${reg.fecha}</td><td>${glucosaAyunas}</td><td>${tensionAM}</td><td>${reg.actividadFisica || 'N/A'}</td><td>${reg.medicacion || 'N/A'}</td></tr>`;
      });
      html += `</tbody></table>`;
    } else {
      html += `<h3>📝 Informe Detallado</h3>`;
      datos.forEach(reg => {
        html += `<div class="section"><div class="entry-date">📅 ${reg.fecha}</div>`;
        
        const glucosaEntries = Object.keys(reg.glucosa || {}).filter(key => reg.glucosa[key]?.valor);
        if (glucosaEntries.length > 0) {
          html += `<h4>🩸 Glucosa</h4><table><thead><tr><th>Horario</th><th>Valor</th><th>Observaciones</th></tr></thead><tbody>`;
          glucosaEntries.forEach(key => {
            html += `<tr><td>${key}</td><td>${reg.glucosa[key].valor} mg/dL</td><td>${reg.glucosa[key].observaciones || 'N/A'}</td></tr>`;
          });
          html += `</tbody></table>`;
        }
        
        const tensionEntries = Object.keys(reg.tensionArterial || {}).filter(key => reg.tensionArterial[key]?.sistolica);
        if (tensionEntries.length > 0) {
          html += `<h4>❤️ Tensión Arterial</h4><table><thead><tr><th>Horario</th><th>Sistólica</th><th>Diastólica</th><th>Pulso</th></tr></thead><tbody>`;
          tensionEntries.forEach(key => {
            html += `<tr><td>${key}</td><td>${reg.tensionArterial[key].sistolica}</td><td>${reg.tensionArterial[key].diastolica}</td><td>${reg.tensionArterial[key].pulso || 'N/A'}</td></tr>`;
          });
          html += `</tbody></table>`;
        }

        if (reg.actividadFisica || reg.medicacion) {
          html += `<div class="section">`;
          if (reg.actividadFisica) html += `<p><strong>🏃 Actividad Física:</strong> ${reg.actividadFisica}</p>`;
          if (reg.medicacion) html += `<p><strong>💊 Medicación:</strong> ${reg.medicacion}</p>`;
          if (reg.observacionesGenerales) html += `<p><strong>📝 Observaciones:</strong> ${reg.observacionesGenerales}</p>`;
          html += `</div>`;
        }
        
        html += `</div>`;
      });
    }

    html += `<div class="no-print" style="margin-top:30px;padding:15px;background-color:#f0f8ff;border-radius:8px;text-align:center"><p>Generado por Glucosa App - ${new Date().toLocaleDateString()}</p></div></body></html>`;
    return html;
  };

  const compartirInforme = async () => {
    if (!reporteHTML) {
      mostrarSnackbar("Genera un informe primero");
      return;
    }
    
    try {
      const fileUri = FileSystem.documentDirectory + `informe_salud_${Date.now()}.html`;
      await FileSystem.writeAsStringAsync(fileUri, reporteHTML);
      
      await Share.share({
        title: '📊 Informe de Salud',
        message: 'Aquí está tu informe de salud generado por Glucosa App',
        url: fileUri,
      });
    } catch (error) {
      console.error("Error al compartir el informe:", error);
      mostrarSnackbar("Error al compartir el informe");
    }
  };

  const descargarHTML = async () => {
    if (!reporteHTML) {
      mostrarSnackbar("Genera un informe primero");
      return;
    }

    try {
      const fileName = `Informe_Salud_${selectedTimeframe}_${new Date().toISOString().split('T')[0]}.html`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(fileUri, reporteHTML, { encoding: FileSystem.EncodingType.UTF8 });

      await Share.share({
        title: 'Guardar HTML',
        url: fileUri,
      });
    } catch (error) {
      console.error("Error al guardar HTML:", error);
      mostrarSnackbar("Error al guardar el HTML");
    }
  };

  const formattedDate = selectedDate.toISOString().split('T')[0];

  return (
    <View style={styles.fullScreen}>
      

      <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContent}>
            <TouchableOpacity onPress={() => { setMenuVisible(false); descargarHTML(); }} style={styles.menuItem}>
              <Text>Descargar HTML</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity onPress={() => { setMenuVisible(false); compartirInforme(); }} style={styles.menuItem}>
              <Text>Compartir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.statsSurface} elevation={2}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📊</Text>
              <Text variant="titleMedium" style={styles.statNumber}>{registros.length}</Text>
              <Text variant="bodySmall">Registros totales</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statIcon}>📅</Text>
              <Text variant="titleMedium" style={styles.statNumber}>
                {registros.filter(reg => reg.fecha === new Date().toISOString().split('T')[0]).length}
              </Text>
              <Text variant="bodySmall">Hoy</Text>
            </View>
          </View>
        </Surface>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>📅 Rango de Tiempo</Text>
            <View style={styles.chipsContainer}>
              {timeframes.map((tf, index) => (
                <TouchableRipple key={index} onPress={() => generarInforme(tf.days, tf.label)}>
                  <Chip style={styles.chip} selected={selectedTimeframe === tf.label}>
                    {tf.label}
                  </Chip>
                </TouchableRipple>
              ))}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>🔍 Buscar por Fecha</Text>
            <View style={styles.dateContainer}>
              <Chip onPress={() => setShowDatePicker(true)} style={styles.dateChip}>
                {formattedDate}
              </Chip>
              {showDatePicker && (
                <DateTimePicker value={selectedDate} mode="date" display="default" onChange={onDateChange} maximumDate={new Date()} />
              )}
              <Button mode="contained" onPress={buscarPorFecha} style={styles.searchButton}>
                Buscar
              </Button>
            </View>
          </Card.Content>
        </Card>

        {loading && (
          <Surface style={styles.loadingSurface} elevation={2}>
            <ActivityIndicator size="large" color="#009FDA" />
            <Text variant="bodyMedium" style={styles.loadingText}>Generando informe...</Text>
          </Surface>
        )}

        {reporte && (
          <Surface style={styles.reportSurface} elevation={4}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportIcon}>📄</Text>
              <Text variant="titleMedium" style={styles.reportTitle}>{reporte}</Text>
            </View>
            <View style={styles.buttonRow}>
              <Button mode="contained" onPress={compartirInforme} style={styles.actionButton}>
                Compartir
              </Button>
              <Button mode="outlined" onPress={() => setMenuVisible(true)} style={styles.actionButton}>
                Descargar
              </Button>
            </View>
          </Surface>
        )}
      </ScrollView>

      <Modal visible={dialogVisible} transparent animationType="fade" onRequestClose={() => setDialogVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.dialogContent}>
            <Text style={styles.dialogIcon}>📄</Text>
            <Text style={styles.dialogTitle}>Informe Generado</Text>
            <Text style={styles.dialogMessage}>Tu informe está listo para compartir o descargar.</Text>
            <View style={styles.dialogActions}>
              <Button onPress={() => setDialogVisible(false)}>Cerrar</Button>
              <Button mode="contained" onPress={compartirInforme}>Compartir</Button>
              <Button mode="outlined" onPress={() => setMenuVisible(true)}>Descargar</Button>
            </View>
          </View>
        </View>
      </Modal>

      {snackbarVisible && (
        <View style={styles.snackbar}>
          <Text style={styles.snackbarText}>{snackbarMessage}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.fab} onPress={cargarRegistros}>
        <Text style={styles.fabIcon}>🔄</Text>
        <Text style={styles.fabText}>Actualizar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: { flex: 1, backgroundColor: '#f5f5f5' },
  appbar: { backgroundColor: '#009FDA' },
  scrollContent: { padding: 16, paddingBottom: 100 },
  statsSurface: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, padding: 16 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statNumber: { color: '#009FDA', fontWeight: 'bold', marginVertical: 4 },
  card: { marginBottom: 16, borderRadius: 16 },
  cardTitle: { color: '#009FDA', marginBottom: 12, fontWeight: 'bold' },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { margin: 2, backgroundColor: '#f0f8ff' },
  dateContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dateChip: { flex: 1, backgroundColor: '#f0f8ff' },
  searchButton: { backgroundColor: '#009FDA' },
  loadingSurface: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 16 },
  loadingText: { marginTop: 12, color: '#666' },
  reportSurface: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  reportIcon: { fontSize: 24 },
  reportTitle: { color: '#4caf50', fontWeight: 'bold' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  actionButton: { flex: 1 },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    width: 200,
  },
  menuItem: {
    padding: 16,
  },
  dialogContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '80%',
  },
  dialogIcon: { fontSize: 32, marginBottom: 8 },
  dialogTitle: { fontSize: 18, fontWeight: 'bold', color: '#009FDA', marginBottom: 8 },
  dialogMessage: { textAlign: 'center', marginBottom: 16 },
  dialogActions: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  snackbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#323232',
    padding: 16,
  },
  snackbarText: { color: 'white' },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#009FDA',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  fabIcon: { color: 'white', marginRight: 4 },
  fabText: { color: 'white' }
});