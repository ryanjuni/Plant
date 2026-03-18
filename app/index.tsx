import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router'; 
import * as THREE from 'three';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

// Caminho do seu modelo 3D - Certifique-se de que o arquivo está nesta pasta
const modelPath = require('../assets/tropical_plant_2.glb');

interface ModeloProps {
  setPronto: (val: boolean) => void;
}

function ModeloPlanta({ setPronto }: ModeloProps) {
  // O parâmetro 'true' ativa o cache do loader para evitar recarregamentos intermitentes
  const { scene } = useGLTF(modelPath, true) as any;
  const plantRef = useRef<THREE.Group>(null);

  const objetoFinal = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child.isMesh) {
        // Remove elementos de cenário indesejados do GLB
        if (child.name.toLowerCase().includes('plane') || child.name.toLowerCase().includes('floor')) {
          child.visible = false;
        }
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Ajuste de material para performance e compatibilidade
        if (child.material) {
          child.material.precision = 'lowp';
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    if (objetoFinal) {
      // Delay estratégico para suavizar a transição do loading para o 3D
      const timer = setTimeout(() => setPronto(true), 200);
      return () => clearTimeout(timer);
    }
  }, [objetoFinal, setPronto]);

  useFrame((state, delta) => {
    if (plantRef.current) {
      // Rotação suave constante
      plantRef.current.rotation.y += 0.12 * delta;
    }
  });

  if (!objetoFinal) return null;

  return <primitive ref={plantRef} object={objetoFinal} scale={2.4} position={[0, -0.8, 0]} />;
}

export default function App() {
  const [carregado, setCarregado] = useState(false);
  const router = useRouter(); 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.appFrame}>
        <View style={styles.header}>
          <Text style={styles.span}>SITUAÇÃO ATUAL</Text>
          <Text style={styles.h1}>Monitoramento</Text>
        </View>

        <View style={styles.canvasContainer}>
          {/* Overlay de carregamento */}
          {!carregado && (
            <View style={styles.loadingArea}>
              <View style={styles.logoCard}>
                <MaterialCommunityIcons name="leaf" size={100} color="#6ab04c" />
              </View>
              <ActivityIndicator size="large" color="#6ab04c" style={{ marginTop: 25 }} />
              <Text style={styles.loadingText}>Sincronizando planta...</Text>
            </View>
          )}

          <Canvas 
            camera={{ position: [0, 2, 8], fov: 45 }}
            frameloop="always" // Vital para o modelo não sumir no Android
            onCreated={(state) => {
              state.gl.setClearColor('#ffffff');
              // Ajuste de cores para evitar lavagem de branco na Web
              state.gl.toneMapping = THREE.ACESFilmicToneMapping;
            }}
          >
            {/* SETUP DE LUZES REFORMULADO */}
            <ambientLight intensity={1.5} /> 
            {/* Luz de Hemisfério: Céu branco, Chão tom terra (clareia o fundo do vaso) */}
            <hemisphereLight args={['#ffffff', '#3d2b1f', 1.2]} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <directionalLight position={[-5, 5, 5]} intensity={1.2} />

            <Suspense fallback={null}>
              <group key="cena-principal">
                <ModeloPlanta setPronto={setCarregado} />
                
                {/* Vaso (Dodecaedro) - Corrigido para Web e Mobile */}
                <mesh position={[0, -1.0, 0]} rotation={[0.5, 0, 0]} scale={[1.4, 0.6, 1.4]}>
                  <dodecahedronGeometry args={[1, 0]} /> 
                  <meshStandardMaterial 
                    color="#5d4037" 
                    roughness={0.4} 
                    metalness={0.3}
                    flatShading 
                  />
                </mesh>
              </group>
            </Suspense>

            <OrbitControls 
              makeDefault 
              enablePan={false}         
              minDistance={5}           
              maxDistance={12}           
              minPolarAngle={Math.PI / 4} 
              maxPolarAngle={Math.PI / 1.8} 
              enableDamping={true}      
              dampingFactor={0.07}
            />
          </Canvas>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.card, { backgroundColor: '#fff9eb' }]}>
            <MaterialCommunityIcons name="thermometer" size={20} color="#ffa502" />
            <Text style={styles.label}>TEMPERATURA</Text>
            <Text style={styles.value}>24.5°C</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f2fcf2' }]}>
            <MaterialCommunityIcons name="water-percent" size={20} color="#2ed573" />
            <Text style={styles.label}>UMIDADE</Text>
            <Text style={styles.value}>62%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f0f7ff' }]}>
            <MaterialCommunityIcons name="white-balance-sunny" size={20} color="#1e90ff" />
            <Text style={styles.label}>LUZ</Text>
            <Text style={styles.value}>88%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f7f2f7' }]}>
            <MaterialCommunityIcons name="heart-pulse" size={20} color="#ff4757" />
            <Text style={styles.label}>SAÚDE</Text>
            <Text style={styles.value}>Excelente</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.subMenu}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Analise')}>
            <Text style={styles.subMenu}>Analise</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Relatorio')}>
            <Text style={styles.subMenu}>Relatório</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/Config')}>
            <Text style={styles.subMenu}>Config</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  appFrame: { flex: 1 },
  header: { padding: 20, paddingTop: 40 },
  span: { color: '#999', fontSize: 11 },
  h1: { fontSize: 24, fontWeight: 'bold', color: '#2d3436' },
  canvasContainer: { flex: 3, width: '100%' }, 
  loadingArea: { 
    position: 'absolute', 
    zIndex: 10, 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  logoCard: {
    width: 160,
    height: 160,
    backgroundColor: '#fff',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 15,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: '#6ab04c',
    fontWeight: '500'
  },
  statsGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 10 
  },
  card: { width: '48%', padding: 15, borderRadius: 20, marginBottom: 12 },
  label: { fontSize: 10, color: '#777', fontWeight: 'bold', marginTop: 5 },
  value: { fontSize: 18, fontWeight: '800' },
  menu: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingBottom: 25, 
    paddingTop: 15, 
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff' 
  },
  subMenu: { fontSize: 12, fontWeight: 'bold', color: '#333' },
});