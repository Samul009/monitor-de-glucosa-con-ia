import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Text } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

export default function GlucosaDashboard({ registros, loading, sugerenciaIA }) {
    
    const ultimosSieteRegistros = registros.slice(-7);
    const fechas = ultimosSieteRegistros.map(reg => new Date(reg.fecha).toLocaleDateString().slice(0, 5));
    
    const glucosaData = ultimosSieteRegistros.map(reg => {
        const glucosaValues = Object.values(reg.glucosa).map(g => g.valor ? parseFloat(g.valor) : null).filter(v => v !== null);
        return glucosaValues.length > 0 ? glucosaValues[0] : null;
    });

    const glucosaChartData = {
        labels: fechas,
        datasets: [
            {
                data: glucosaData,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    const sistolicaData = ultimosSieteRegistros.map(reg => {
        const tensionValues = Object.values(reg.tensionArterial).map(t => t.sistolica ? parseFloat(t.sistolica) : null).filter(v => v !== null);
        return tensionValues.length > 0 ? tensionValues[0] : null;
    });

    const diastolicaData = ultimosSieteRegistros.map(reg => {
        const tensionValues = Object.values(reg.tensionArterial).map(t => t.diastolica ? parseFloat(t.diastolica) : null).filter(v => v !== null);
        return tensionValues.length > 0 ? tensionValues[0] : null;
    });

    const tensionChartData = {
        labels: fechas,
        datasets: [
            {
                data: sistolicaData,
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                strokeWidth: 2,
                label: 'Sistólica'
            },
            {
                data: diastolicaData,
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                strokeWidth: 2,
                label: 'Diastólica'
            },
        ],
        legend: ['Sistólica', 'Diastólica']
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.cardTitle}>Mi Resumen de Salud</Title>
                    {loading ? (
                        <ActivityIndicator animating={true} color="#009FDA" />
                    ) : (
                        <Paragraph style={styles.paragraph}>{sugerenciaIA}</Paragraph>
                    )}
                </Card.Content>
            </Card>

            {registros.length > 0 && (
                <>
                    <Card style={styles.chartCard}>
                        <Card.Content>
                            <Title style={styles.chartTitle}>Glucosa (últimos 7 días)</Title>
                            {glucosaData.some(v => v !== null) ? (
                                <LineChart
                                    data={glucosaChartData}
                                    width={screenWidth - 40}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#f2f2f7',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: { borderRadius: 16 },
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            ) : (
                                <Text style={styles.noDataText}>No hay suficientes datos de glucosa para mostrar la gráfica.</Text>
                            )}
                        </Card.Content>
                    </Card>

                    <Card style={styles.chartCard}>
                        <Card.Content>
                            <Title style={styles.chartTitle}>Tensión Arterial (últimos 7 días)</Title>
                            {sistolicaData.some(v => v !== null) ? (
                                <LineChart
                                    data={tensionChartData}
                                    width={screenWidth - 40}
                                    height={220}
                                    chartConfig={{
                                        backgroundColor: '#ffffff',
                                        backgroundGradientFrom: '#ffffff',
                                        backgroundGradientTo: '#f2f2f7',
                                        decimalPlaces: 0,
                                        color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`,
                                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                        style: { borderRadius: 16 },
                                    }}
                                    bezier
                                    style={styles.chart}
                                />
                            ) : (
                                <Text style={styles.noDataText}>No hay suficientes datos de tensión para mostrar la gráfica.</Text>
                            )}
                        </Card.Content>
                    </Card>
                </>
            )}

            <Card style={styles.historyCard}>
                <Card.Content>
                    <Title style={styles.cardTitle}>Últimos Registros</Title>
                    {registros.length === 0 ? (
                        <Text style={styles.noDataText}>No hay registros recientes.</Text>
                    ) : (
                        registros.slice(-5).reverse().map((reg, index) => (
                            <View key={index} style={styles.registroItem}>
                                <Text style={styles.registroDate}>{new Date(reg.fecha).toLocaleDateString()}</Text>
                                {reg.tipo === 'glucosa' && (
                                    Object.keys(reg.glucosa).map((key) => 
                                        reg.glucosa[key].valor ? (
                                            <Text key={key} style={styles.registroDetail}>
                                                - {key}: {reg.glucosa[key].valor} mg/dL
                                            </Text>
                                        ) : null
                                    )
                                )}
                                {reg.tipo === 'tensionArterial' && (
                                    Object.keys(reg.tensionArterial).map((key) => 
                                        reg.tensionArterial[key].sistolica ? (
                                            <Text key={key} style={styles.registroDetail}>
                                                - {key}: {reg.tensionArterial[key].sistolica}/{reg.tensionArterial[key].diastolica} mmHg
                                            </Text>
                                        ) : null
                                    )
                                )}
                            </View>
                        ))
                    )}
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f7',
    },
    card: {
        marginBottom: 20,
        borderRadius: 12,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
        marginTop: 15,
    },
    chartCard: {
        marginBottom: 20,
        borderRadius: 12,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#009FDA',
        marginBottom: 10,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    paragraph: {
        fontSize: 16,
        color: '#555',
    },
    historyCard: {
        marginBottom: 20,
        borderRadius: 12,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 15,
    },
    registroItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    registroDate: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
    },
    registroDetail: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    noDataText: {
        textAlign: 'center',
        color: '#888',
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
