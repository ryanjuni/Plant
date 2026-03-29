import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router'; 
import * as THREE from 'three';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { useLanguage } from './LanguageContext'; 
import { buscarDadosTrefle, atualizarClimaAgro, buscarDadosSinric } from '../Api/services'; 

const modelPath = require('../assets/watermelon_bush.glb');

// Componente do Modelo 3D
function ModeloPlanta({ setPronto }: { setPronto: (val: boolean) => void }) {
  const { scene } = useGLTF(modelPath) as any;
  const plantRef = useRef<THREE.Group>(null);

  const objetoProcessado = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child?.isMesh) {
        if (child.name?.toLowerCase().includes('plane')) child.visible = false;
        child.castShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => { if (objetoProcessado) setPronto(true); }, [objetoProcessado, setPronto]);

  useFrame((_, delta) => {
    if (plantRef.current) plantRef.current.rotation.y += 0.15 * delta;
  });

  return objetoProcessado ? <primitive ref={plantRef} object={objetoProcessado} scale={2.5} position={[0, -0.6, 0]} /> : null;
}

export default function IndexScreen() {
  const router = useRouter();
  const { t } = useLanguage(); 
  const [carregado, setCarregado] = useState(false);
  const isMounted = useRef(true);

  const [dadosCultivo, setDadosCultivo] = useState({
    temperatura: "--",
    umidadeAr: "--",
    riscoSecaKey: "low", 
    luzSolarKey: "excellent",
    dicaKey: "syncing",
    fonte: "📡 Conectando..." 
  });

  const [extraInfo, setExtraInfo] = useState({ nomeCientifico: "" });

  const sincronizarAutomatizado = async () => {
    // Busca dados em paralelo para performance
    const [clima, sensorReal, planta] = await Promise.all([
      atualizarClimaAgro(-19.7675, -44.0886),
      buscarDadosSinric(),
      buscarDadosTrefle('watermelon')
    ]);

    if (isMounted.current) {
      // 1. Prioridade: Se o sensorReal (ESP32) trouxer dados válidos, usa ele.
      // Caso contrário, usa o Clima da API (Fallback).
      const sensorAtivo = sensorReal && sensorReal.temperature !== null;
      
      const tempFinal = sensorAtivo 
        ? Math.round(sensorReal.temperature) 
        : (clima ? Math.round(clima.main.temp - 273.15) : 0);

      const humArFinal = sensorAtivo 
        ? Math.round(sensorReal.humidity) 
        : (clima ? clima.main.humidity : 0);

      // 2. Umidade do Solo (Exclusivo do Hardware ou Valor Seguro de 75%)
      const soloFinal = (sensorReal && sensorReal.powerLevel !== null) 
        ? sensorReal.powerLevel 
        : 75; 

      // 3. Lógica de Status Automática
      let seca = "low";
      if (soloFinal < 30) seca = "high";
      else if (soloFinal < 60) seca = "medium";

      let dica = "ideal_cond";
      if (seca === "high") dica = "water_now";
      else if (tempFinal > 35) dica = "heat_alert";

      setDadosCultivo({
        temperatura: tempFinal.toString(),
        umidadeAr: humArFinal.toString(),
        riscoSecaKey: seca,
        luzSolarKey: (clima && clima.clouds.all > 50) ? "moderate" : "excellent",
        dicaKey: dica,
        fonte: sensorAtivo ? "⚡ Sensor Real" : "☁️ API Clima"
      });

      if (planta) setExtraInfo({ nomeCientifico: planta.scientific_name });
    }
  };

  useEffect(() => {
    isMounted.current = true;
    sincronizarAutomatizado();

    // Atualiza sozinho a cada 30 segundos
    const interval = setInterval(sincronizarAutomatizado, 30000);

    return () => { 
      isMounted.current = false; 
      clearInterval(interval);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Badge discreto mostrando a origem do dado */}
      <View style={styles.badgeFonte}>
        <Text style={styles.badgeText}>{dadosCultivo.fonte}</Text>
      </View>

      <View style={styles.appFrame}>
        <View style={styles.header}>
          <Text style={styles.span}>{t('watermelon_name').toUpperCase()} {extraInfo.nomeCientifico && `(${extraInfo.nomeCientifico})`}</Text>
          <Text style={styles.h1}>{t('my_cultivation')}</Text>
          
          <View style={[styles.dicaContainer, { backgroundColor: dadosCultivo.riscoSecaKey === 'high' ? '#fff1f1' : '#f2fcf2' }]}>
            <MaterialCommunityIcons 
              name={dadosCultivo.riscoSecaKey === 'high' ? "alert-circle" : "check-circle"} 
              size={14} 
              color={dadosCultivo.riscoSecaKey === 'high' ? "#ff4757" : "#6ab04c"} 
            />
            <Text style={[styles.dicaText, { color: dadosCultivo.riscoSecaKey === 'high' ? "#ff4757" : "#6ab04c" }]}>
              {t(dadosCultivo.dicaKey)}
            </Text>
          </View>
        </View>

        <View style={styles.canvasContainer}>
          {!carregado && <ActivityIndicator style={StyleSheet.absoluteFill} color="#6ab04c" />}
          <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
            <ambientLight intensity={0.8} /><pointLight position={[5, 5, 5]} intensity={1.5} />
            <Suspense fallback={null}>
              <group>
                <ModeloPlanta setPronto={setCarregado} />
                <mesh position={[0, -1.0, 0]} rotation={[0.5, 0, 0]} scale={[1.4, 0.6, 1.4]}>
                  <dodecahedronGeometry args={[1, 0]} /> 
                  <meshStandardMaterial color="#5d4037" roughness={0.8} />
                </mesh>
              </group>
            </Suspense>
            <OrbitControls enablePan={false} />
          </Canvas>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.card, { backgroundColor: '#fff9eb' }]}>
            <MaterialCommunityIcons name="thermometer" size={18} color="#ffa502" />
            <Text style={styles.label}>{t('temp_env')}</Text>
            <Text style={styles.value}>{dadosCultivo.temperatura}°C</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f0f7ff' }]}>
            <MaterialCommunityIcons name="white-balance-sunny" size={18} color="#1e90ff" />
            <Text style={styles.label}>{t('solar_light')}</Text>
            <Text style={styles.value}>{t(dadosCultivo.luzSolarKey)}</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f2fcf2' }]}>
            <MaterialCommunityIcons name="water-percent" size={18} color="#2ed573" />
            <Text style={styles.label}>{t('air_humidity')}</Text>
            <Text style={styles.value}>{dadosCultivo.umidadeAr}%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: dadosCultivo.riscoSecaKey === 'high' ? '#fff1f1' : '#fef1f1' }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ff4757" />
            <Text style={styles.label}>{t('drought_risk')}</Text>
            <Text style={[styles.value, {color: dadosCultivo.riscoSecaKey === 'high' ? '#ff4757' : '#2d3436'}]}>
              {t(dadosCultivo.riscoSecaKey)}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}><MaterialCommunityIcons name="home-variant" size={26} color="#2D6A4F" /></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Analise')}><MaterialCommunityIcons name="chart-timeline-variant" size={26} color="#a0a0a0" /></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Relatorio')}><MaterialCommunityIcons name="file-document-outline" size={26} color="#a0a0a0" /></TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Config')}><MaterialCommunityIcons name="cog-outline" size={26} color="#a0a0a0" /></TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  appFrame: { flex: 1 },
  header: { paddingHorizontal: 25, paddingTop: 30 },
  span: { color: '#bbb', fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  h1: { fontSize: 26, fontWeight: '800', color: '#2d3436', marginTop: 4 },
  dicaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, padding: 8, borderRadius: 12 },
  dicaText: { fontSize: 12, fontWeight: '600', marginLeft: 6 },
  canvasContainer: { flex: 1, minHeight: 330 }, 
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 20 },
  card: { width: '47%', padding: 18, borderRadius: 24, marginBottom: 15 },
  label: { fontSize: 9, color: '#888', fontWeight: 'bold', marginTop: 8 },
  value: { fontSize: 20, fontWeight: '800', color: '#2d3436' },
  menu: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 85, borderTopWidth: 1, borderTopColor: '#f8f8f8' },
  menuItem: { padding: 15 },
  badgeFonte: {
    position: 'absolute',
    top: 45,
    right: 25,
    zIndex: 10,
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8
  },
  badgeText: { fontSize: 9, color: '#747d8c', fontWeight: 'bold' }
});