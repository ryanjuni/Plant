import React from 'react';
import { GlobalStyles } from './theme'; 
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, FileText, Clock } from 'lucide-react-native';

export default function RelatorioScreen() {
  const router = useRouter();

  const handleDownloadPDF = () => {
    Alert.alert("PDF", "Gerando relatório para download...");
    // Aqui no futuro você pode integrar com expo-print ou expo-sharing
  };

  const handleFechar = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.dashboard}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.liveIndicator}>
            <View style={styles.dot} />
            <Text style={styles.liveText}>SISTEMA ATIVO</Text>
          </View>
          <TouchableOpacity onPress={handleFechar} style={styles.closeBtn}>
            <X size={24} color="#d2d2d7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroSection}>
            <Text style={styles.overline}>ANÁLISE DE HOJE</Text>
            <Text style={styles.title}>RELATÓRIO</Text>
            <View style={styles.timeRow}>
              <Clock size={12} color="#86868b" />
              <Text style={styles.timeText}> Atualizado em 18/03/2026</Text>
            </View>
          </View>

          {/* Grid de Cards */}
          <View style={styles.metricsGrid}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Umidade</Text>
              <Text style={styles.cardValue}>62%</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Luz</Text>
              <Text style={styles.cardValue}>850lx</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Temperatura</Text>
              <Text style={styles.cardValue}>24.2°C</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Tanque</Text>
              <Text style={styles.cardValue}>OK</Text>
            </View>
          </View>

          {/* Status Box */}
          <View style={styles.statusBox}>
            <Text style={styles.statusText}>
              <Text style={{ fontWeight: '800' }}>Status: </Text>
              O sistema de irrigação automática está operando normalmente. Solo estável.
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.btnDownload} onPress={handleDownloadPDF}>
            <FileText size={20} color="#FFF" />
            <Text style={styles.btnText}>Baixar PDF</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9ECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboard: {
    width: '90%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 35,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(45, 106, 79, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: '#2D6A4F',
    borderRadius: 3,
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2D6A4F',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  closeBtn: {
    padding: 5,
  },
  content: {
    paddingHorizontal: 25,
    paddingBottom: 30,
  },
  heroSection: {
    marginBottom: 20,
  },
  overline: {
    fontSize: 11,
    fontWeight: '700',
    color: '#86868b',
    letterSpacing: 0.5,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    marginVertical: 5,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    color: '#86868b',
    fontSize: 12,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#fbfbfd',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
    marginBottom: 15,
  },
  cardLabel: {
    fontSize: 12,
    color: '#86868b',
    fontWeight: '600',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 5,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  statusBox: {
    marginTop: 15,
    padding: 20,
    borderRadius: 20,
    backgroundColor: '#f5f5f7',
    borderWidth: 1,
    borderColor: '#eee',
  },
  statusText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#1d1d1f',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  footer: {
    padding: 25,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  btnDownload: {
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
});