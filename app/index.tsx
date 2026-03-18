import React, { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls } from '@react-three/drei/native';
import { StatusBar } from 'expo-status-bar';
import * as THREE from 'three';

const modelPath = require('../assets/tropical_plant_2.glb');

function ModeloPlanta({ setPronto }: { setPronto: (val: boolean) => void }) {
  const { scene } = useGLTF(modelPath) as any;
  const plantRef = useRef<THREE.Group>(null);

  const objetoFinal = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child.isMesh) {
        if (child.name.toLowerCase().includes('plane') || child.name.toLowerCase().includes('floor')) {
          child.visible = false;
        }
        if (child.material) {
          child.material.transparent = false;
          child.castShadow = false;
          child.receiveShadow = false;
        }
      }
    });
    return clone;
  }, [scene]);

  useEffect(() => {
    if (objetoFinal) setPronto(true);
  }, [objetoFinal, setPronto]);

  useFrame((_, delta) => {
    if (plantRef.current) {
      plantRef.current.rotation.y += 0.15 * delta;
    }
  });

  if (!objetoFinal) return null;

  return <primitive ref={plantRef} object={objetoFinal} scale={2.3} position={[0, -1.0, 0]} />;
}

export default function App() {
  const [carregado, setCarregado] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.appFrame}>
        <View style={styles.header}>
          <Text style={styles.span}>SITUAÇÃO ATUAL</Text>
          <Text style={styles.h1}>Modelo 3D</Text>
        </View>

        <View style={styles.canvasContainer}>
          {!carregado && (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#6ab04c" />
            </View>
          )}

          <Canvas 
            key="canvas-planta" // Força o refresh da memória do Expo
            camera={{ position: [0, 1.5, 6.5], fov: 50 }} // Câmera mais próxima e centralizada
            onCreated={(state) => {
              const gl = state.gl as THREE.WebGLRenderer;
              gl.setClearColor('#ffffff');
              (gl as any).outputColorSpace = THREE.SRGBColorSpace;
            }}
          >
            <ambientLight intensity={2.5} /> 
            <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#1a110a" />
            <directionalLight position={[5, 10, 5]} intensity={2.0} />

            <Suspense fallback={null}>
              <group>
                <ModeloPlanta setPronto={setCarregado} />
                
                {/* Montinho de Terra - Mantido escuro como você pediu */}
                <mesh position={[0, -1.2, 0]} rotation={[0.5, 0, 0]} scale={[1.3, 0.5, 1.3]}>
                  <dodecahedronGeometry args={[1, 0]} /> 
                  <meshStandardMaterial color="#1a110a" roughness={1} flatShading />
                </mesh>
              </group>
            </Suspense>

            <OrbitControls makeDefault enablePan={false} minDistance={4} maxDistance={10} />
          </Canvas>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.card, { backgroundColor: '#fff9eb' }]}>
            <Text style={styles.label}>TEMPERATURA</Text>
            <Text style={styles.value}>24.5°C</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f2fcf2' }]}>
            <Text style={styles.label}>UMIDADE</Text>
            <Text style={styles.value}>62%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f0f7ff' }]}>
            <Text style={styles.label}>LUZ</Text>
            <Text style={styles.value}>88%</Text>
          </View>
          <View style={[styles.card, { backgroundColor: '#f7f2f7' }]}>
            <Text style={styles.label}>SAÚDE</Text>
            <Text style={styles.value}>Excelente</Text>
          </View>
        </View>

        <View style={styles.menu}>
          <TouchableOpacity><Text style={styles.subMenu}>Home</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.subMenu}>Analise</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.subMenu}>Relatório</Text></TouchableOpacity>
          <TouchableOpacity><Text style={styles.subMenu}>Config</Text></TouchableOpacity>
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
  canvasContainer: { flex: 2.8, width: '100%' }, // Espaço amplo para a planta
  loadingArea: { position: 'absolute', zIndex: 10, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 15 },
  card: { width: '48%', padding: 15, borderRadius: 20, marginBottom: 12 },
  label: { fontSize: 10, color: '#777', fontWeight: 'bold' },
  value: { fontSize: 18, fontWeight: '800' },
  menu: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 25, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  subMenu: { fontSize: 12, fontWeight: 'bold', color: '#333' },
});