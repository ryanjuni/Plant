// responsável: Ryan junio - tela principal do app.

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, ContactShadows, OrbitControls } from '@react-three/drei/native';
import { useAssets } from 'expo-asset';
import * as THREE from 'three';

// Componente da Planta 3D
function ModeloPlanta({ onLoaded }: { onLoaded: () => void }) {
  const [assets] = useAssets([require('../assets/tropical_plant_2.glb')]);
  const gltf = assets ? useGLTF(assets[0].uri) : null;
  const plantRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (gltf) onLoaded();
  }, [gltf]);

  useFrame((state, delta) => {
    if (plantRef.current) {
      plantRef.current.rotation.y += 0.3 * delta;
    }
  });

  if (!gltf) return null;

  return (
    <primitive 
      ref={plantRef} 
      object={gltf.scene} 
      scale={2.1} // Reduzi levemente a escala para não cortar nas bordas
      position={[0, -1.1, 0]} 
    />
  );
}

export default function TelaPrincipal() {
  const [carregado, setCarregado] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appFrame}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.span}>Situação Atual</Text>
          <Text style={styles.h1}>Modelo 3D</Text>
          <TouchableOpacity style={styles.informacoes}>
            <Text style={styles.txtInformacoes}>mais informações</Text>
          </TouchableOpacity>
        </View>

        {/* Canvas Container */}
        <View style={styles.canvasContainer}>
          {!carregado && (
            <View style={styles.loadingArea}>
              <ActivityIndicator size="large" color="#6ab04c" />
              <Text style={{ marginTop: 10, color: '#999' }}>Carregando Modelo...</Text>
            </View>
          )}

          <Canvas 
            camera={{ 
              position: [0, 2, 6], // Afastei a câmera (de 5 para 6)
              fov: 45,             // Field of View: maior ângulo de visão
              near: 0.1,           // Renderiza tudo que estiver bem perto
              far: 1000            // Evita que o fundo corte o modelo
            }}
          >
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <directionalLight position={[-5, 5, 5]} intensity={1} />
            
            <Suspense fallback={null}>
              <ModeloPlanta onLoaded={() => setCarregado(true)} />
              
              {/* Montinho de terra Menor e com Triângulos */}
              <mesh 
                position={[0, -1.25, 0]} 
                rotation={[0.5, 0, 0]} 
                scale={[1.0, 0.4, 1.0]} 
              >
                <dodecahedronGeometry args={[1, 0]} /> 
                <meshStandardMaterial 
                  color="#3d2b1f" 
                  flatShading={true} 
                  roughness={1} 
                />
              </mesh>

              <ContactShadows opacity={0.4} scale={6} blur={2.4} far={1} position={[0, -1.26, 0]} />
            </Suspense>

            <OrbitControls 
              enablePan={false} 
              enableZoom={true} 
              minDistance={3.6} // Impede de chegar perto demais e bugar
              maxDistance={9}   // Impede de sumir no infinito
            />
          </Canvas>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.card, styles.temp]}>
            <Text style={styles.label}>TEMPERATURA</Text>
            <Text style={styles.value}>24.5°C</Text>
          </View>
          <View style={[styles.card, styles.hum]}>
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

        {/* Menu Inferior */}
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
  span: { color: '#999', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 },
  h1: { fontSize: 24, fontWeight: 'bold', color: '#2d3436', marginVertical: 4 },
  informacoes: { marginTop: 10, paddingVertical: 8, paddingHorizontal: 15, borderWidth: 2, borderColor: '#6ab04c', borderRadius: 20, alignSelf: 'flex-start' },
  txtInformacoes: { color: '#6ab04c', fontSize: 14, fontWeight: 'bold' },
  canvasContainer: { 
    flex: 1.2, // Aumentei um pouco a proporção do ambiente 3D
    justifyContent: 'center' 
  },
  loadingArea: { position: 'absolute', zIndex: 1, width: '100%', alignItems: 'center' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 15, borderTopWidth: 1, borderTopColor: '#eee' },
  card: { width: '48%', padding: 15, borderRadius: 20, marginBottom: 12 },
  temp: { backgroundColor: '#fff9eb' },
  hum: { backgroundColor: '#f2fcf2' },
  label: { fontSize: 10, color: '#777', fontWeight: 'bold', marginBottom: 5 },
  value: { fontSize: 18, fontWeight: '800', color: '#2d3436' },
  menu: { flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 30, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  subMenu: { fontSize: 12, fontWeight: 'bold', color: '#2d3436' },
});
