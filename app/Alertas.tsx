import React, { useState } from 'react';
import { GlobalStyles } from './theme'; 
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView, 
  StatusBar,
  Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Notification {
  id: string;
  title: string;
  message: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  time: string;
  fullMessage: string;
}

export default function NotificacoesScreen() {
  const router = useRouter(); // Hook de navegação
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotify, setSelectedNotify] = useState<Notification | null>(null);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: '1', 
      title: 'Umidade Baixa', 
      message: 'Sensor 01 detectou solo crítico.', 
      icon: 'water-alert', 
      color: '#ff3b30', 
      time: '5 min',
      fullMessage: 'A Samambaia precisa de água imediatamente! O nível de umidade está abaixo de 20%.'
    },
    { 
      id: '2', 
      title: 'Relatório Diário', 
      message: 'Tudo sob controle no monitoramento.', 
      icon: 'leaf', 
      color: '#34c759', 
      time: 'Ontem',
      fullMessage: 'Seu jardim está em perfeitas condições hoje. Todos os sensores operando normalmente.'
    },
  ]);

  const openNotify = (item: Notification) => {
    setSelectedNotify(item);
    setModalVisible(true);
  };

  const deleteNotify = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.card} 
      onPress={() => openNotify(item)}
    >
      <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
        <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
      </View>
      
      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.timestamp}>{item.time}</Text>
        </View>
        <Text style={styles.cardMessage} numberOfLines={1}>{item.message}</Text>
      </View>

      <TouchableOpacity onPress={() => deleteNotify(item.id)} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="close-circle-outline" size={20} color="#d1d1d6" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header com botão de fechar corrigido */}
      <View style={styles.header}>
        <TouchableOpacity 
          // MUDEI AQUI: router.replace('/') garante que volte para a raiz (index)
          onPress={() => router.replace('/')} 
          style={styles.closeButton}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <MaterialCommunityIcons name="close" size={26} color="#000" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Alertas</Text>
        
        {/* View vazia apenas para equilibrar o Flexbox e centralizar o título */}
        <View style={{ width: 40 }} /> 
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="bell-off-outline" size={48} color="#d1d1d6" />
            <Text style={styles.emptyText}>Nenhum alerta pendente</Text>
          </View>
        }
      />

      <Modal animationType="fade" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconCircle, { backgroundColor: selectedNotify?.color + '15' }]}>
               <MaterialCommunityIcons name={selectedNotify?.icon || 'bell'} size={32} color={selectedNotify?.color} />
            </View>
            <Text style={styles.modalTitle}>{selectedNotify?.title}</Text>
            <Text style={styles.modalBody}>{selectedNotify?.fullMessage}</Text>
            
            <TouchableOpacity style={styles.btnOk} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnOkText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10, // Garante que o botão esteja acima de outros elementos
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    fontFamily: GlobalStyles.fontFamily,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  card: {
    backgroundColor: '#fbfbfb',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2d3436',
    fontFamily: GlobalStyles.fontFamily,
  },
  timestamp: {
    fontSize: 11,
    color: '#a0a0a0',
    fontFamily: GlobalStyles.fontFamily,
  },
  cardMessage: {
    fontSize: 13,
    color: '#636e72',
    fontFamily: GlobalStyles.fontFamily,
  },
  deleteBtn: {
    paddingLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#a0a0a0',
    fontSize: 14,
    marginTop: 10,
    fontFamily: GlobalStyles.fontFamily,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'white',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
  },
  modalIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    fontFamily: GlobalStyles.fontFamily,
  },
  modalBody: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: GlobalStyles.fontFamily,
  },
  btnOk: {
    backgroundColor: '#000',
    width: '100%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  btnOkText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: GlobalStyles.fontFamily,
  },
});