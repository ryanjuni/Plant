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
  Platform 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Interface para as notificações
interface Notification {
  id: string;
  title: string;
  message: string;
  icon: any; // Nome do ícone do MaterialCommunityIcons
  color: string;
  time: string;
  fullMessage: string;
}

export default function NotificacoesScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { 
      id: '1', 
      title: 'Umidade Baixa', 
      message: 'Sensor 01 detectou solo crítico.', 
      icon: 'water-alert', 
      color: '#ff7675', 
      time: '5 min',
      fullMessage: 'A Samambaia precisa de água imediatamente! O nível de umidade está abaixo de 20%.'
    },
    { 
      id: '2', 
      title: 'Relatório Diário', 
      message: 'Tudo sob controle no monitoramento.', 
      icon: 'leaf', 
      color: '#2ecc71', 
      time: 'Ontem',
      fullMessage: 'Seu jardim está em perfeitas condições hoje. Todos os sensores operando normalmente.'
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotify, setSelectedNotify] = useState<Notification | null>(null);

  // Abrir detalhes da notificação
  const openNotify = (item: Notification) => {
    setSelectedNotify(item);
    setModalVisible(true);
  };

  // Deletar notificação
  const deleteNotify = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity style={styles.card} onPress={() => openNotify(item)}>
      <View style={styles.iconBox}>
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {item.title} <Text style={styles.timestamp}>• {item.time}</Text>
        </Text>
        <Text style={styles.cardMessage}>{item.message}</Text>
      </View>

      <TouchableOpacity onPress={() => deleteNotify(item.id)} style={styles.deleteBtn}>
        <MaterialCommunityIcons name="close" size={20} color="#dfe6e9" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alertas do Sistema</Text>
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notifications.length} novas</Text>
          </View>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum alerta pendente.</Text>
        }
      />

      {/* Modal de Detalhes (Pop-up) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons 
              name={selectedNotify?.icon || 'bell'} 
              size={50} 
              color={selectedNotify?.color || '#2ecc71'} 
              style={{ marginBottom: 10 }}
            />
            <Text style={styles.modalTitle}>{selectedNotify?.title}</Text>
            <Text style={styles.modalBody}>{selectedNotify?.fullMessage}</Text>
            
            <TouchableOpacity 
              style={styles.btnOk} 
              onPress={() => setModalVisible(false)}
            >
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
    backgroundColor: '#f0f2f5',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  badge: {
    backgroundColor: '#ff7675',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  list: {
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  timestamp: {
    fontSize: 12,
    color: '#b2bec3',
    fontWeight: 'normal',
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  cardMessage: {
    fontSize: 14,
    color: '#636e72',
    marginTop: 2,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  deleteBtn: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 50,
    fontSize: 16,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 10,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  modalBody: {
    fontSize: 14,
    color: '#636e72',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
  btnOk: {
    backgroundColor: '#2ecc71',
    width: '100%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnOkText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: GlobalStyles.fontFamily, // Aplicado
  },
});