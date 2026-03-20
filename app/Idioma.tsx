import React, { useEffect } from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  ScrollView, StatusBar, Alert 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from './LanguageContext'; // IMPORTANTE: Usar o Contexto
import { GlobalStyles } from './theme'; 

const languages = [
  { id: 'pt', name: 'Português', icon: 'translate' },
  { id: 'en', name: 'English', icon: 'translate' },
  { id: 'es', name: 'Español', icon: 'translate' },
  { id: 'fr', name: 'Français', icon: 'translate' },
];

export default function IdiomaScreen() {
  const router = useRouter();
  
  // Puxamos os dados globais aqui
  const { locale, changeLanguage, t } = useLanguage();

  const handleSelectLanguage = async (id: string) => {
    // Esta função altera o estado no Contexto e salva no AsyncStorage automaticamente
    await changeLanguage(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('language')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('language_select')}</Text>
        
        {languages.map((lang) => (
          <TouchableOpacity 
            key={lang.id} 
            style={[
              styles.languageCard, 
              locale === lang.id && styles.selectedCard // Verifica o idioma global
            ]}
            onPress={() => handleSelectLanguage(lang.id)}
          >
            <View style={styles.leftInfo}>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={22} 
                color={locale === lang.id ? "#4CAF50" : "#e0e0e0"} 
              />
              <Text style={[
                styles.languageName,
                locale === lang.id && styles.selectedText
              ]}>
                {lang.name}
              </Text>
            </View>

            {locale === lang.id && (
              <MaterialCommunityIcons name="check" size={20} color="#4CAF50" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botão Confirmar */}
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.saveButtonText}>{t('save')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 20 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  content: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 14, color: '#a0a0a0', marginBottom: 20 },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fbfbfb',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0'
  },
  selectedCard: { borderColor: '#4CAF50', backgroundColor: '#f2fcf2' },
  leftInfo: { flexDirection: 'row', alignItems: 'center' },
  languageName: { fontSize: 16, marginLeft: 15, color: '#444' },
  selectedText: { color: '#000', fontWeight: '700' },
  saveButton: { backgroundColor: '#4CAF50', margin: 24, paddingVertical: 18, borderRadius: 20, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});