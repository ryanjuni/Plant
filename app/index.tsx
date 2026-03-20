import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router'; 
import * as THREE from 'three';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { GlobalStyles } from './theme'; 
import { useLanguage } from './LanguageContext'; 
import { buscarDadosTrefle, atualizarClimaAgro } from '../Api/services'; 

const modelPath = require('../assets/watermelon_bush.glb');

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

  useEffect(() => {
    if (objetoProcessado) setPronto(true);
  }, [objetoProcessado, setPronto]);

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
    dicaKey: "syncing" 
  });

  const [extraInfo, setExtraInfo] = useState({
    statusCeuKey: "searching",
    nomeCientifico: ""
  });

  useEffect(() => {
    isMounted.current = true;
    
    const carregarInteligenciaAgro = async () => {
      const clima = await atualizarClimaAgro(-19.7675, -44.0886);
      
      if (clima && isMounted.current) {
        const temp = Math.round(clima.main.temp - 273.15);
        const umid = clima.main.humidity;
        const nuvens = clima.clouds.all;
        const vento = clima.wind.speed;

        let luz = "excellent";
        if (nuvens > 50) luz = "moderate";
        if (nuvens > 80) luz = "low_light";

        let seca = "low";
        if (temp > 28 && umid < 50) seca = "high";
        else if (temp > 22 || vento > 5) seca = "medium";

        let dica = "ideal_cond";
        if (seca === "high") dica = "water_now";
        else if (umid > 85) dica = "high_humidity";
        else if (temp < 15) dica = "cold_alert";

        setDadosCultivo({
          temperatura: temp.toString(),
          umidadeAr: umid.toString(),
          riscoSecaKey: seca,
          luzSolarKey: luz,
          dicaKey: dica
        });

        const descChave = clima.weather[0].description.toLowerCase().replace(/\s+/g, "_");
        setExtraInfo(prev => ({ ...prev, statusCeuKey: descChave }));
      }

      const planta = await buscarDadosTrefle('watermelon');
      if (planta && isMounted.current) {
        setExtraInfo(prev => ({ ...prev, nomeCientifico: planta.scientific_name }));
      }
    };

    carregarInteligenciaAgro();
    return () => { isMounted.current = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.appFrame}>
        
        <View style={styles.header}>
          <Text style={styles.span}>
            {t('watermelon_name').toUpperCase()} {extraInfo.nomeCientifico ? `(${extraInfo.nomeCientifico})` : ''}
          </Text>
          <Text style={styles.h1}>{t('my_cultivation')}</Text>
          <View style={styles.dicaContainer}>
            <MaterialCommunityIcons name="lightbulb-on" size={14} color="#6ab04c" />
            <Text style={styles.dicaText}>{t(dadosCultivo.dicaKey)}</Text>
          </View>
        </View>

        <View style={styles.canvasContainer}>
          {!carregado && <ActivityIndicator style={StyleSheet.absoluteFill} color="#6ab04c" />}
          <Canvas camera={{ position: [0, 2, 7], fov: 45 }}>
            <ambientLight intensity={0.8} /> 
            <pointLight position={[5, 5, 5]} intensity={1.5} />
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
            {/* CORREÇÃO: Chamando t() para traduzir moderate/excellent */}
            <Text style={styles.value}>{t(dadosCultivo.luzSolarKey)}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#f2fcf2' }]}>
            <MaterialCommunityIcons name="water-percent" size={18} color="#2ed573" />
            <Text style={styles.label}>{t('air_humidity')}</Text>
            <Text style={styles.value}>{dadosCultivo.umidadeAr}%</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#fef1f1' }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ff4757" />
            <Text style={styles.label}>{t('drought_risk')}</Text>
            {/* CORREÇÃO: Chamando t() para traduzir low/medium/high */}
            <Text style={[styles.value, {color: dadosCultivo.riscoSecaKey === 'high' ? '#ff4757' : '#2d3436'}]}>
              {t(dadosCultivo.riscoSecaKey)}
            </Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/')}>
             <MaterialCommunityIcons name="home-variant" size={26} color="#2D6A4F" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Analise')}>
             <MaterialCommunityIcons name="chart-timeline-variant" size={26} color="#a0a0a0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Relatorio')}>
             <MaterialCommunityIcons name="file-document-outline" size={26} color="#a0a0a0" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/Config')}>
             <MaterialCommunityIcons name="cog-outline" size={26} color="#a0a0a0" />
          </TouchableOpacity>
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
  dicaContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: '#f2fcf2', padding: 8, borderRadius: 12 },
  dicaText: { fontSize: 12, color: '#6ab04c', fontWeight: '600', marginLeft: 6 },
  canvasContainer: { flex: 1, minHeight: 330 }, 
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 25, marginBottom: 20 },
  card: { width: '47%', padding: 18, borderRadius: 24, marginBottom: 15 },
  label: { fontSize: 9, color: '#888', fontWeight: 'bold', marginTop: 8 },
  value: { fontSize: 20, fontWeight: '800', color: '#2d3436' },
  menu: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 85, borderTopWidth: 1, borderTopColor: '#f8f8f8' },
  menuItem: { padding: 15 }
});