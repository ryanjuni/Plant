import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  ScrollView, StatusBar, ActivityIndicator 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from './LanguageContext'; 
import { atualizarClimaAgro } from '../Api/services'; // Usando sua API existente

export default function DadosSensorScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  
  // Dados simulando o sensor físico + API
  const [sensorData, setSensorData] = useState({
    solo: 65,         // % de umidade no vaso
    reservatorio: 80, // % de água na caixa
    temperatura: 0,   // Vem da API
    pressao: 0,       // Vem da API
    status: 'Online'
  });

  useEffect(() => {
    carregarDados();
    // Simula atualização a cada 10 segundos
    const interval = setInterval(carregarDados, 10000);
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      const clima = await atualizarClimaAgro(-19.7675, -44.0886);
      if (clima) {
        setSensorData(prev => ({
          ...prev,
          temperatura: Math.round(clima.main.temp - 273.15),
          pressao: clima.main.pressure,
          // Simulando oscilação do sensor de solo
          solo: Math.floor(Math.random() * (70 - 60 + 1)) + 60 
        }));
      }
    } catch (e) {
      console.log("Erro ao buscar dados do sensor");
    } finally {
      setLoading(false);
    }
  };

  const ProgressBar = ({ progress, color }: { progress: number, color: string }) => (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sensor_data')}</Text>
        <TouchableOpacity onPress={() => { setLoading(true); carregarDados(); }}>
          <MaterialCommunityIcons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{t('sensor_status')}: {t('connected')}</Text>
          <Text style={styles.timeText}>ID: ESP32-HORTA-01</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 50 }} />
        ) : (
          <View style={styles.grid}>
            
            {/* Umidade do Solo */}
            <View style={styles.cardFull}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="opacity" size={24} color="#3498db" />
                <Text style={styles.cardTitle}>{t('soil_moisture')}</Text>
                <Text style={styles.cardValue}>{sensorData.solo}%</Text>
              </View>
              <ProgressBar progress={sensorData.solo} color="#3498db" />
            </View>

            {/* Nível de Água */}
            <View style={styles.cardFull}>
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="waves" size={24} color="#2ecc71" />
                <Text style={styles.cardTitle}>{t('water_level')}</Text>
                <Text style={styles.cardValue}>{sensorData.reservatorio}%</Text>
              </View>
              <ProgressBar progress={sensorData.reservatorio} color="#2ecc71" />
            </View>

            {/* Temperatura (da API) */}
            <View style={styles.smallCard}>
              <MaterialCommunityIcons name="thermometer" size={28} color="#e67e22" />
              <Text style={styles.smallLabel}>Ambiente</Text>
              <Text style={styles.smallValue}>{sensorData.temperatura}°C</Text>
            </View>

            {/* Pressão (da API) */}
            <View style={styles.smallCard}>
              <MaterialCommunityIcons name="gauge" size={28} color="#9b59b6" />
              <Text style={styles.smallLabel}>Pressão</Text>
              <Text style={styles.smallValue}>{sensorData.pressao} hPa</Text>
            </View>

          </View>
        )}

        <Text style={styles.footerNote}>*{t('last_update')}: {new Date().toLocaleTimeString()}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  content: { paddingHorizontal: 24 },
  statusCard: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ecc71', marginRight: 10 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#2d3436', flex: 1 },
  timeText: { fontSize: 10, color: '#a0a0a0' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  cardFull: { width: '100%', backgroundColor: '#fbfbfb', padding: 20, borderRadius: 20, marginBottom: 15 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { flex: 1, marginLeft: 10, fontSize: 14, color: '#636e72', fontWeight: '600' },
  cardValue: { fontSize: 18, fontWeight: '800', color: '#2d3436' },
  progressBg: { height: 8, backgroundColor: '#eee', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  smallCard: { width: '47%', backgroundColor: '#fbfbfb', padding: 20, borderRadius: 20, alignItems: 'center', marginBottom: 15 },
  smallLabel: { fontSize: 11, color: '#a0a0a0', marginTop: 8, textTransform: 'uppercase', fontWeight: '700' },
  smallValue: { fontSize: 18, fontWeight: '800', color: '#2d3436', marginTop: 4 },
  footerNote: { textAlign: 'center', color: '#d1d1d6', fontSize: 11, marginTop: 20 }
});