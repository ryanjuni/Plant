import React from 'react';
import { GlobalStyles } from './theme'; 
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Alert,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SettingItem = ({ icon, label, onPress, isLogout }: any) => (
  <TouchableOpacity 
    activeOpacity={0.5}
    style={styles.item} 
    onPress={onPress}
  >
    <View style={styles.leftContent}>
      <MaterialCommunityIcons 
        name={icon} 
        size={22} 
        color={isLogout ? "#ff3b30" : "#2d3436"} 
      />
      <Text style={[styles.label, isLogout && styles.logoutText]}>{label}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Minimalista */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Section title="Conta">
          <SettingItem icon="account-outline" label="Perfil do Usuário" onPress={() => {}} />
        </Section>

        <Section title="Horta Digital">
          <SettingItem icon="bell-outline" label="Notificações" onPress={() =>  router.push('./Alertas')} />
          <SettingItem icon="cube-outline" label="Cadastro de plantas e espécies" onPress={() => router.push('./Cadastrar')} />
          <SettingItem icon="database-outline" label="Dados do Sensor" onPress={() => {}} />
        </Section>

        <Section title="Geral">
          <SettingItem icon="earth" label="Idioma" onPress={() => {}} />
          <SettingItem icon="information-outline" label="Sobre o Projeto" onPress={() => {}} />
        </Section>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={() => Alert.alert("Sair", "Deseja encerrar a sessão?")}
        >
          <Text style={styles.logoutButtonText}>Encerrar Sessão</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>v1.0.2 • Desenvolvido pela Equipe</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fundo branco puro
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.4,
    color: '#000',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#a0a0a0',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
    marginLeft: 4,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  card: {
    backgroundColor: '#fbfbfb', 
    borderRadius: 20,
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 14,
    color: '#2d3436',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: '#fff1f0',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#ff3b30',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  logoutText: {
    color: '#ff3b30',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  footerText: {
    textAlign: 'center',
    color: '#d1d1d6',
    fontSize: 11,
    marginTop: 32,
    letterSpacing: 0.5,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
});