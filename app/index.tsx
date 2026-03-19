import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router'; 
import * as THREE from 'three';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import { GlobalStyles } from './theme'; 
import { buscarDadosTrefle, atualizarClimaAgro } from '../Api/services'; 

const modelPath = require('../assets/watermelon_bush.glb');

const tradutorClima: { [key: string]: string } = {
  "clear sky": "Sol Pleno",
  "few clouds": "Sol Parcial",
  "scattered clouds": "Nublado",
  "broken clouds": "Encoberto",
  "shower rain": "Chuva Leve",
  "rain": "Chuva",
  "thunderstorm": "Tempestade",
  "mist": "Neblina"
};

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
  const [carregado, setCarregado] = useState(false);
  const isMounted = useRef(true);

  const [dadosCultivo, setDadosCultivo] = useState({
    temperatura: "--",
    umidadeAr: "--",
    riscoSeca: "Baixo",
    luzSolar: "Boa",
    dica: "Sincronizando dados..."
  });

  const [extraInfo, setExtraInfo] = useState({
    statusCeu: "Buscando...",
    especie: "MELANCIA"
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

        let luz = "Excelente";
        if (nuvens > 50) luz = "Moderada";
        if (nuvens > 80) luz = "Baixa";

        let seca = "Baixo";
        if (temp > 28 && umid < 50) seca = "ALTO";
        else if (temp > 22 || vento > 5) seca = "Médio";

        let recomendacao = "Planta em condições ideais.";
        if (seca === "ALTO") recomendacao = "Solo secando rápido! Regue agora.";
        else if (umid > 85) recomendacao = "Muita umidade. Cuidado com fungos.";
        else if (temp < 15) recomendacao = "Frio detectado. Proteja a muda.";

        setDadosCultivo({
          temperatura: temp.toString(),
          umidadeAr: umid.toString(),
          riscoSeca: seca,
          luzSolar: luz,
          dica: recomendacao
        });

        const descIngles = clima.weather[0].description.toLowerCase();
        setExtraInfo(prev => ({ 
          ...prev, 
          statusCeu: tradutorClima[descIngles] || descIngles 
        }));
      }

      const planta = await buscarDadosTrefle('watermelon');
      if (planta && isMounted.current) {
        setExtraInfo(prev => ({ ...prev, especie: `MELANCIA (${planta.scientific_name})` }));
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
          <Text style={styles.span}>{extraInfo.especie.toUpperCase()}</Text>
          <Text style={styles.h1}>Meu Cultivo</Text>
          <View style={styles.dicaContainer}>
            <MaterialCommunityIcons name="lightbulb-on" size={14} color="#6ab04c" />
            <Text style={styles.dicaText}>{dadosCultivo.dica}</Text>
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
            <Text style={styles.label}>CALOR AMBIENTE</Text>
            <Text style={styles.value}>{dadosCultivo.temperatura}°C</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#f0f7ff' }]}>
            <MaterialCommunityIcons name="white-balance-sunny" size={18} color="#1e90ff" />
            <Text style={styles.label}>LUZ SOLAR</Text>
            <Text style={styles.value}>{dadosCultivo.luzSolar}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#f2fcf2' }]}>
            <MaterialCommunityIcons name="water-percent" size={18} color="#2ed573" />
            <Text style={styles.label}>UMIDADE AR</Text>
            <Text style={styles.value}>{dadosCultivo.umidadeAr}%</Text>
          </View>

          <View style={[styles.card, { backgroundColor: '#fef1f1' }]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#ff4757" />
            <Text style={styles.label}>RISCO DE SECA</Text>
            <Text style={[styles.value, {color: dadosCultivo.riscoSeca === 'ALTO' ? '#ff4757' : '#2d3436'}]}>
              {dadosCultivo.riscoSeca}
            </Text>
          </View>
        </View>

        {/* MENU COM NAVEGAÇÃO REATIVADA */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/')}>
             <MaterialCommunityIcons name="home-variant" size={26} color="#000" />
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