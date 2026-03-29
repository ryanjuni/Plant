import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GlobalStyles } from './theme'; 
import { useLanguage } from './LanguageContext'; // Importando o contexto global

const SettingItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity 
    activeOpacity={0.5}
    style={styles.item} 
    onPress={onPress}
  >
    <View style={styles.leftContent}>
      <MaterialCommunityIcons 
        name={icon} 
        size={22} 
        color="#2d3436" 
      />
      <Text style={styles.label}>{label}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={18} color="#d1d1d6" />
  </TouchableOpacity>
);

const Section = ({ children, title }: any) => (
  <View style={styles.section}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    <View style={styles.card}>{children}</View>
  </View>
);

export default function ConfigScreen() {
  const router = useRouter();
  const { t } = useLanguage(); // Função de tradução global

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/')}>
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('settings_title')}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Section title={t('account_section')}>
          <SettingItem 
            icon="account-outline" 
            label={t('profile_user')} 
            onPress={() => router.push('/Perfil' as any)} 
          />
        </Section>

        <Section title={t('horta_section')}>
          <SettingItem icon="bell-outline" label={t('notifications')} onPress={() => router.push('/Alertas' as any)} />
          <SettingItem icon="cube-outline" label="Cadastro de plantas" onPress={() => router.push('/Cadastrar' as any)} />
          <SettingItem icon="database-outline" label={t('sensor_data')} onPress={() => router.push('/DadosSensor' as any)} />
        </Section>

        <Section title={t('general_section')}>
          <SettingItem icon="earth" label={t('language')} onPress={() => router.push('/Idioma' as any)} />
          <SettingItem icon="information-outline" label={t('about')} onPress={() => router.push('/Sobre' as any)} />
        </Section>

        <Text style={styles.footerText}>v1.0.2 • Desenvolvido pela Equipe</Text>
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
  headerTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#000', 
    fontFamily: GlobalStyles.fontFamily 
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  section: { marginBottom: 32 },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#a0a0a0', 
    textTransform: 'uppercase', 
    marginBottom: 16, 
    marginLeft: 4, 
    fontFamily: GlobalStyles.fontFamily 
  },
  card: { backgroundColor: '#fbfbfb', borderRadius: 20, paddingVertical: 8 },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: 16, 
    paddingHorizontal: 20 
  },
  leftContent: { flexDirection: 'row', alignItems: 'center' },
  label: { 
    fontSize: 15, 
    marginLeft: 14, 
    color: '#2d3436', 
    fontFamily: GlobalStyles.fontFamily 
  },
  footerText: { 
    textAlign: 'center', 
    color: '#d1d1d6', 
    fontSize: 11, 
    marginTop: 32, 
    fontFamily: GlobalStyles.fontFamily 
  }
});