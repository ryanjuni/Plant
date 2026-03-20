import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  ScrollView, Image, StatusBar, Alert, TextInput 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GlobalStyles } from './theme'; 

const Section = ({ children }: any) => <View style={styles.card}>{children}</View>;

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Estados com valores iniciais de carregamento
  const [name, setName] = useState('Carregando...');
  const [location, setLocation] = useState('...');
  const [image, setImage] = useState('https://cdn.pixabay.com/photo/2016/11/29/13/20/beard-1869766_1280.jpg');

  // Carrega os dados assim que a tela abre (mesmo após F5)
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('@user_image');
      const savedName = await AsyncStorage.getItem('@user_name');
      const savedLocation = await AsyncStorage.getItem('@user_location');

      // Se existir dado no banco, usa ele. Se não, usa o padrão.
      setName(savedName || 'Johan Smith');
      setLocation(savedLocation || 'California, USA');
      if (savedImage) setImage(savedImage);
      
    } catch (e) {
      console.log("Erro ao carregar dados", e);
      setName('Johan Smith');
    }
  };

  const handleSave = async () => {
    try {
      // Salva permanentemente
      await AsyncStorage.setItem('@user_image', image);
      await AsyncStorage.setItem('@user_name', name);
      await AsyncStorage.setItem('@user_location', location);
      
      setIsEditing(false);
      Alert.alert("Sucesso", "Perfil atualizado!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão", "Precisamos de acesso às suas fotos.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, 
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        {/* CORREÇÃO DA SETA: router.canGoBack() evita que o botão trave após um Refresh */}
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <MaterialCommunityIcons 
            name={isEditing ? "check" : "square-edit-outline"} 
            size={24} 
            color={isEditing ? "#4CAF50" : "#000"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileInfoHeader}>
          <TouchableOpacity onPress={pickImage} disabled={!isEditing} style={styles.avatarContainer}>
            <Image source={{ uri: image }} style={[styles.profileAvatar, isEditing && styles.editingAvatar]} />
            {isEditing && (
              <View style={styles.cameraIconBadge}>
                <MaterialCommunityIcons name="camera" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editInputContainer}>
              <TextInput style={styles.inputName} value={name} onChangeText={setName} autoFocus />
              <TextInput style={styles.inputLocation} value={location} onChangeText={setLocation} />
            </View>
          ) : (
            <>
              <Text style={styles.profileName}>{name}</Text>
              <Text style={styles.profileLocation}>{location}</Text>
            </>
          )}
        </View>

        <Section>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}><Text style={styles.statNumber}>24</Text><Text style={styles.statLabel}>Espécies</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}><Text style={styles.statNumber}>87</Text><Text style={styles.statLabel}>Plantas</Text></View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}><Text style={styles.statNumber}>5</Text><Text style={styles.statLabel}>Sensores</Text></View>
          </View>
        </Section>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={[styles.logoutButton, isEditing && { opacity: 0.5 }]} 
          onPress={() => router.replace('/Login')}
          disabled={isEditing}
        >
          <Text style={styles.logoutButtonText}>Encerrar Sessão</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Horta Digital v1.0.2</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  profileInfoHeader: { alignItems: 'center', marginVertical: 24 },
  avatarContainer: { position: 'relative' },
  profileAvatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  editingAvatar: { opacity: 0.6, borderWidth: 3, borderColor: '#4CAF50' },
  cameraIconBadge: { position: 'absolute', bottom: 20, right: 5, backgroundColor: '#4CAF50', padding: 8, borderRadius: 20, elevation: 5 },
  profileName: { fontSize: 22, fontWeight: '600', color: '#000', fontFamily: GlobalStyles.fontFamily },
  profileLocation: { fontSize: 14, color: '#a0a0a0', marginTop: 4, fontFamily: GlobalStyles.fontFamily },
  editInputContainer: { width: '100%', alignItems: 'center' },
  inputName: { fontSize: 22, fontWeight: '600', borderBottomWidth: 1, borderColor: '#4CAF50', width: '80%', textAlign: 'center', marginBottom: 8, color: '#000' },
  inputLocation: { fontSize: 14, borderBottomWidth: 1, borderColor: '#ccc', width: '60%', textAlign: 'center', color: '#666' },
  card: { backgroundColor: '#fbfbfb', borderRadius: 20, padding: 16, marginBottom: 16 },
  statsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  statCard: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 20, fontWeight: '700' },
  statLabel: { fontSize: 10, color: '#a0a0a0', textTransform: 'uppercase' },
  statDivider: { width: 1, height: 30, backgroundColor: '#eee' },
  saveButton: { backgroundColor: '#4CAF50', paddingVertical: 16, borderRadius: 20, alignItems: 'center', marginBottom: 10 },
  saveButtonText: { color: '#fff', fontWeight: '600' },
  logoutButton: { marginTop: 10, backgroundColor: '#fff1f0', paddingVertical: 16, borderRadius: 20, alignItems: 'center' },
  logoutButtonText: { color: '#ff3b30', fontWeight: '600' },
  footerText: { textAlign: 'center', color: '#d1d1d6', fontSize: 11, marginTop: 32 },
});