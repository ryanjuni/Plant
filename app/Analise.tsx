import React, { useState } from 'react';
import { GlobalStyles } from './theme'; 
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions 
} from 'react-native';
import { LineChart } from "react-native-chart-kit";
import { X } from 'lucide-react-native';
import { useRouter } from 'expo-router'; // 1. Importação do roteador

const screenWidth = Dimensions.get("window").width;

// Interface para o banco de dados de simulação
interface DataPoint {
  labels: string[];
  data: number[];
  stats: {
    ph: string;
    tds: string;
    water: string;
  };
}

interface Database {
  [key: string]: DataPoint;
}

const database: Database = {
  weekly: {
    labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    data: [6.5, 6.2, 6.8, 6.5, 6.4, 6.7, 6.5],
    stats: { ph: '6.5', tds: '850', water: '94%' }
  },
  monthly: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    data: [6.1, 6.3, 6.6, 6.4, 6.8, 6.5],
    stats: { ph: '6.4', tds: '810', water: '91%' }
  }
};

export default function AnaliseScreen() {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const router = useRouter(); // 2. Inicialização do roteador

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Análise de Cultivo</Text>
        
        {/* 3. Botão de fechar configurado para voltar */}
        <TouchableOpacity 
          style={styles.closeBtn} 
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <X size={20} color="#86868b" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          onPress={() => setViewMode('weekly')}
          style={[styles.tabLink, viewMode === 'weekly' && styles.tabActive]}
        >
          <Text style={[styles.tabText, viewMode === 'weekly' && styles.tabTextActive]}>Semanal</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => setViewMode('monthly')}
          style={[styles.tabLink, viewMode === 'monthly' && styles.tabActive]}
        >
          <Text style={[styles.tabText, viewMode === 'monthly' && styles.tabTextActive]}>Mensal</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chartCard}>
        <LineChart
          data={{
            labels: database[viewMode].labels,
            datasets: [{ data: database[viewMode].data }]
          }}
          width={screenWidth - 60} 
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(27, 67, 50, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(134, 134, 139, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "5", strokeWidth: "2", stroke: "#1B4332" }
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsGrid}>
        <MetricItem 
          label="Média pH" 
          value={`${database[viewMode].stats.ph} pH`} 
          color="#FF9F43" 
          status="Equilibrado" 
        />
        <MetricItem 
          label="Nutrientes" 
          value={`${database[viewMode].stats.tds} ppm`} 
          color="#00CFE8" 
          status="Estável" 
        />
        <MetricItem 
          label="Eficiência" 
          value={database[viewMode].stats.water} 
          color="#28C76F" 
          status="Excelente" 
        />
      </View>
    </ScrollView>
  );
}

// Subcomponente de métricas com tipagem TS
interface MetricItemProps {
  label: string;
  value: string;
  color: string;
  status: string;
}

function MetricItem({ label, value, color, status }: MetricItemProps) {
  return (
    <View style={styles.metricCard}>
      <View>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F8' },
  content: { padding: 25, paddingTop: 60 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#1B4332',
    fontFamily: GlobalStyles.fontFamily // Aplicado
  },
  closeBtn: { 
    backgroundColor: '#FFF', 
    padding: 10, 
    borderRadius: 25,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabs: { flexDirection: 'row', gap: 20, marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  tabLink: { paddingBottom: 10 },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#1B4332' },
  tabText: { 
    fontSize: 16, 
    color: '#888', 
    fontWeight: '600',
    fontFamily: GlobalStyles.fontFamily // Aplicado
  },
  tabTextActive: { 
    color: '#1B4332',
    fontFamily: GlobalStyles.fontFamily // Aplicado
  },
  chartCard: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 15, 
    elevation: 4, 
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  chart: { borderRadius: 16, marginVertical: 8 },
  statsGrid: { gap: 15 },
  metricCard: { 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#F0F0F0' 
  },
  metricLabel: { 
    fontSize: 11, 
    color: '#888', 
    fontWeight: 'bold',
    fontFamily: GlobalStyles.fontFamily // Aplicado
  },
  metricValue: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#333',
    fontFamily: GlobalStyles.fontFamily // Aplicado
  },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  badgeText: { 
    color: '#FFF', 
    fontSize: 10, 
    fontWeight: 'bold',
    fontFamily: GlobalStyles.fontFamily // Aplicado
  }
});