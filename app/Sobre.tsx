import React from 'react';
import { 
  StyleSheet, Text, View, TouchableOpacity, SafeAreaView, 
  ScrollView, Image, StatusBar 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLanguage } from './LanguageContext'; 
import { GlobalStyles } from './theme'; 

export default function SobreScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header padrão */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('about')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.logoContainer}>
          {/* Ícone ou Logo do seu App */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="leaf" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.appName}>Horta Digital</Text>
          <Text style={styles.version}>{t('version')} 1.0.2</Text>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            {t('about_description')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('team')}</Text>
          <View style={styles.card}>
            <Text style={styles.memberText}>• Johan Smith (Lead Developer)</Text>
            <Text style={styles.memberText}>• Ana Silva (UI/UX Designer)</Text>
            <Text style={styles.memberText}>• Carlos Souza (IoT Specialist)</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerInfo}>© 2026 Horta Digital S.A.</Text>
          <View style={styles.socialIcons}>
            <MaterialCommunityIcons name="github" size={24} color="#a0a0a0" style={{ marginHorizontal: 10 }} />
            <MaterialCommunityIcons name="linkedin" size={24} color="#a0a0a0" style={{ marginHorizontal: 10 }} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 24, 
    paddingVertical: 20 
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginVertical: 30 },
  iconCircle: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: '#f2fcf2', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 16
  },
  appName: { fontSize: 24, fontWeight: '800', color: '#2d3436' },
  version: { fontSize: 14, color: '#a0a0a0', marginTop: 4 },
  descriptionCard: { 
    backgroundColor: '#fbfbfb', 
    padding: 20, 
    borderRadius: 20, 
    marginBottom: 24 
  },
  descriptionText: { 
    fontSize: 15, 
    lineHeight: 24, 
    color: '#636e72', 
    textAlign: 'center' 
  },
  section: { marginBottom: 30 },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#a0a0a0', 
    textTransform: 'uppercase', 
    marginBottom: 12,
    marginLeft: 5
  },
  card: { 
    backgroundColor: '#fbfbfb', 
    borderRadius: 20, 
    padding: 16 
  },
  memberText: { 
    fontSize: 14, 
    color: '#2d3436', 
    marginBottom: 8, 
    fontWeight: '500' 
  },
  footer: { alignItems: 'center', marginTop: 20 },
  footerInfo: { fontSize: 12, color: '#d1d1d6', marginBottom: 15 },
  socialIcons: { flexDirection: 'row' }
});