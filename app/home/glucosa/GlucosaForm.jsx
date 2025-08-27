import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Card, Text, TextInput, ActivityIndicator } from 'react-native-paper';

// Opciones para el formulario de glucosa
const timeOptionsGlucosa = [
    { key: 'ayunas', label: 'Ayunas' },
    { key: 'dosHorasDesayuno', label: '2h post-desayuno' },
    { key: 'antesAlmuerzo', label: 'Antes de almuerzo' },
    { key: 'dosHorasAlmuerzo', label: '2h post-almuerzo' },
    { key: 'antesCena', label: 'Antes de cena' },
    { key: 'dosHorasCena', label: '2h post-cena' },
    { key: 'tresAM', label: '3 A.M.' },
];

// Opciones para el formulario de tensión arterial
const timeOptionsTension = [
    { key: 'AM', label: 'Mañana' },
    { key: 'PM', label: 'Tarde' },
];

export default function GlucosaForm({ registro, onInputChange, onSave, loading, setRegistro }) {
    const [selectedTimeGlucosa, setSelectedTimeGlucosa] = useState(null);
    const [selectedTimeTension, setSelectedTimeTension] = useState(null);

    const handleTipoChange = (tipo) => {
        setRegistro(prev => ({ ...prev, tipo }));
        setSelectedTimeGlucosa(null);
        setSelectedTimeTension(null);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                <Text style={styles.fechaText}>
                    Fecha: {new Date(registro.fecha).toLocaleDateString()}
                </Text>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Tipo de Registro</Text>
                        <View style={styles.buttonGroup}>
                            <Button
                                mode={registro.tipo === 'glucosa' ? 'contained' : 'outlined'}
                                onPress={() => handleTipoChange('glucosa')}
                                style={styles.tipoButton}
                            >
                                Glucosa
                            </Button>
                            <Button
                                mode={registro.tipo === 'tensionArterial' ? 'contained' : 'outlined'}
                                onPress={() => handleTipoChange('tensionArterial')}
                                style={styles.tipoButton}
                            >
                                Tensión Arterial
                            </Button>
                        </View>
                    </Card.Content>
                </Card>

                {registro.tipo === 'glucosa' && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Glucosa (mg/dL)</Text>
                            <Text style={styles.sectionSubtitle}>Selecciona un horario:</Text>
                            <View style={styles.buttonGroup}>
                                {timeOptionsGlucosa.map(option => (
                                    <Button
                                        key={option.key}
                                        mode={selectedTimeGlucosa === option.key ? 'contained' : 'outlined'}
                                        onPress={() => setSelectedTimeGlucosa(option.key)}
                                        style={styles.timeButton}
                                        labelStyle={styles.timeButtonLabel}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </View>
                            {selectedTimeGlucosa && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label={`Valor (${selectedTimeGlucosa})`}
                                        mode="outlined"
                                        keyboardType="numeric"
                                        value={registro.glucosa[selectedTimeGlucosa]?.valor}
                                        onChangeText={(text) => onInputChange('glucosa', 'valor', text, selectedTimeGlucosa)}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        label="Observaciones"
                                        mode="outlined"
                                        multiline
                                        value={registro.glucosa[selectedTimeGlucosa]?.observaciones}
                                        onChangeText={(text) => onInputChange('glucosa', 'observaciones', text, selectedTimeGlucosa)}
                                        style={styles.input}
                                    />
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                )}

                {registro.tipo === 'tensionArterial' && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.sectionTitle}>Tensión Arterial</Text>
                            <Text style={styles.sectionSubtitle}>Selecciona un horario:</Text>
                            <View style={styles.buttonGroup}>
                                {timeOptionsTension.map(option => (
                                    <Button
                                        key={option.key}
                                        mode={selectedTimeTension === option.key ? 'contained' : 'outlined'}
                                        onPress={() => setSelectedTimeTension(option.key)}
                                        style={styles.timeButton}
                                        labelStyle={styles.timeButtonLabel}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </View>
                            {selectedTimeTension && (
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        label="Sistólica (mmHg)"
                                        mode="outlined"
                                        keyboardType="numeric"
                                        value={registro.tensionArterial[selectedTimeTension]?.sistolica}
                                        onChangeText={(text) => onInputChange('tensionArterial', 'sistolica', text, selectedTimeTension)}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        label="Diastólica (mmHg)"
                                        mode="outlined"
                                        keyboardType="numeric"
                                        value={registro.tensionArterial[selectedTimeTension]?.diastolica}
                                        onChangeText={(text) => onInputChange('tensionArterial', 'diastolica', text, selectedTimeTension)}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        label="Pulso (bpm)"
                                        mode="outlined"
                                        keyboardType="numeric"
                                        value={registro.tensionArterial[selectedTimeTension]?.pulso}
                                        onChangeText={(text) => onInputChange('tensionArterial', 'pulso', text, selectedTimeTension)}
                                        style={styles.input}
                                    />
                                    <TextInput
                                        label="Observaciones"
                                        mode="outlined"
                                        multiline
                                        value={registro.tensionArterial[selectedTimeTension]?.observaciones}
                                        onChangeText={(text) => onInputChange('tensionArterial', 'observaciones', text, selectedTimeTension)}
                                        style={styles.input}
                                    />
                                </View>
                            )}
                        </Card.Content>
                    </Card>
                )}

                <Card style={styles.card}>
                    <Card.Content>
                        <Text variant="titleMedium" style={styles.sectionTitle}>Otros Parámetros</Text>
                        <TextInput
                            label="Actividad Física"
                            mode="outlined"
                            value={registro.actividadFisica}
                            onChangeText={(text) => onInputChange('otros', 'actividadFisica', text)}
                            style={styles.input}
                        />
                        <TextInput
                            label="Medicación"
                            mode="outlined"
                            value={registro.medicacion}
                            onChangeText={(text) => onInputChange('otros', 'medicacion', text)}
                            style={styles.input}
                        />
                        <TextInput
                            label="Observaciones Generales"
                            mode="outlined"
                            multiline
                            numberOfLines={4}
                            value={registro.observacionesGenerales}
                            onChangeText={(text) => onInputChange('otros', 'observacionesGenerales', text)}
                            style={styles.input}
                        />
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={onSave}
                    loading={loading}
                    disabled={loading}
                    style={styles.saveButton}
                    contentStyle={styles.saveButtonContent}
                >
                    {loading ? 'Guardando...' : 'Guardar Registro'}
                </Button>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingVertical: 20,
    },
    container: {
        padding: 10,
    },
    fechaText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
        color: '#555',
    },
    card: {
        marginBottom: 15,
        borderRadius: 12,
        elevation: 4,
    },
    sectionTitle: {
        marginBottom: 10,
        fontWeight: 'bold',
        color: '#009FDA',
    },
    sectionSubtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#555',
    },
    input: {
        marginBottom: 10,
        backgroundColor: '#f9f9f9',
    },
    inputContainer: {
        marginTop: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    tipoButton: {
        margin: 5,
        borderRadius: 20,
    },
    timeButton: {
        margin: 5,
        borderRadius: 20,
        minWidth: 100,
        borderColor: '#009FDA',
    },
    timeButtonLabel: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    saveButton: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#009FDA',
        borderRadius: 10,
    },
    saveButtonContent: {
        paddingVertical: 10,
    },
});
