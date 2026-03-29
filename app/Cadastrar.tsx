import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { GlobalStyles } from './theme'; // Mantendo o padrão do seu app
import { useLanguage } from './LanguageContext'; // Mantendo a tradução

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 64) / 2; // Ajustado para o padding de 24 da sua tela

interface Plant {
  id: string;
  name: string;
  cat: string;
  img: string;
}

const INITIAL_PLANTS: Plant[] = [
  { id: '1', name: "Ora-pro-nóbis", cat: "PANCs", img: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=400&q=80" },
  { id: '2', name: "Manjericão", cat: "Ervas", img: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400&q=80" },
  { id: '3', name: "Cenoura", cat: "Hortaliças", img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80" },
  { id: '4', name: "Tomate", cat: "Hortaliças", img: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&q=80" },
];

const CATEGORIES = ['Todas', 'Hortaliças', 'Ervas', 'PANCs'];

export default function CadastrarScreen() {
  const router = useRouter();
  const { t } = useLanguage(); 

  const [plants, setPlants] = useState<Plant[]>(INITIAL_PLANTS);
  const [currentCat, setCurrentCat] = useState('Todas');
  
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [inputName, setInputName] = useState('');
  const [inputCat, setInputCat] = useState('Hortaliças');

  const filteredPlants = currentCat === 'Todas' 
    ? plants 
    : plants.filter(p => p.cat === currentCat);

  const openModal = (plant: Plant | null = null) => {
    if (plant) {
      setEditId(plant.id);
      setInputName(plant.name);
      setInputCat(plant.cat);
    } else {
      setEditId(null);
      setInputName('');
      setInputCat('Hortaliças');
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setInputName('');
    setInputCat('Hortaliças');
    setEditId(null);
  };

  const handleSave = () => {
    if (!inputName.trim()) {
      Alert.alert("Erro", "Por favor, digite o nome da planta.");
      return;
    }

    if (editId) {
      setPlants(plants.map(p => 
        p.id === editId ? { ...p, name: inputName, cat: inputCat } : p
      ));
    } else {
      const newPlant: Plant = {
        id: Math.random().toString(),
        name: inputName,
        cat: inputCat,
        img: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&q=80"
      };
      setPlants([newPlant, ...plants]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Excluir Planta",
      "Tem certeza que deseja excluir esta planta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => {
          setPlants(plants.filter(p => p.id !== id));
        }}
      ]
    );
  };

  // Função inteligente para voltar
  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Se não houver histórico, força a rota de configurações
      // AJUSTE AQUI: Mude '/ConfigScreen' para o nome do seu arquivo de configurações na pasta app
      router.replace('/Config'); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header idêntico ao da sua tela de Configurações */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <MaterialCommunityIcons name="close" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cadastro de Plantas</Text>
        <View style={{ width: 24 }} /> {/* Espaçador */}
      </View>

      {/* Filtros horizontais com o estilo suave da sua UI */}
      <View style={{ maxHeight: 50 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category}
              style={[styles.chip, currentCat === category && styles.chipActive]}
              onPress={() => setCurrentCat(category)}
            >
              <Text style={[styles.chipText, currentCat === category && styles.chipTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Grid de Plantas */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
        {filteredPlants.map(plant => (
          <View key={plant.id} style={styles.card}>
            <View style={styles.imgContainer}>
              <Image source={{ uri: plant.img }} style={styles.img} />
            </View>
            <Text style={styles.cardCat}>{plant.cat}</Text>
            <Text style={styles.cardName}>{plant.name}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btnAct} onPress={() => openModal(plant)}>
                <MaterialCommunityIcons name="pencil-outline" size={18} color="#2d3436" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnAct} onPress={() => handleDelete(plant.id)}>
                <MaterialCommunityIcons name="trash-can-outline" size={18} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Botão Flutuante moderno */}
      <TouchableOpacity style={styles.fab} onPress={() => openModal()}>
        <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal para adicionar/editar */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? "Editar Planta" : "Nova Espécie"}</Text>
            
            <TextInput 
              style={styles.input}
              placeholder="Nome da planta"
              placeholderTextColor="#a0a0a0"
              value={inputName}
              onChangeText={setInputName}
            />

            <Text style={styles.modalLabel}>Categoria:</Text>
            <View style={styles.modalCategoryContainer}>
              {CATEGORIES.filter(c => c !== 'Todas').map(c => (
                <TouchableOpacity 
                  key={c}
                  style={[styles.miniChip, inputCat === c && styles.miniChipActive]}
                  onPress={() => setInputCat(c)}
                >
                  <Text style={[styles.miniChipText, inputCat === c && styles.miniChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
              <Text style={styles.btnSaveText}>Salvar Alterações</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} style={{marginTop: 18, alignItems: 'center'}}>
              <Text style={{color: '#a0a0a0', fontFamily: GlobalStyles.fontFamily}}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  filterScroll: { paddingHorizontal: 24, marginBottom: 15 },
  chip: { 
    backgroundColor: '#fbfbfb', 
    borderWidth: 1, 
    borderColor: '#f0f0f0', 
    paddingVertical: 8, 
    paddingHorizontal: 16, 
    borderRadius: 50, 
    marginRight: 10, 
    height: 36, 
    justifyContent: 'center' 
  },
  chipActive: { backgroundColor: '#2d3436', borderColor: '#2d3436' },
  chipText: { color: '#a0a0a0', fontSize: 13, fontWeight: '600', fontFamily: GlobalStyles.fontFamily },
  chipTextActive: { color: '#FFFFFF' },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    paddingHorizontal: 24, 
    justifyContent: 'space-between', 
    paddingBottom: 100 
  },
  card: { 
    backgroundColor: '#fbfbfb', 
    borderRadius: 20, 
    padding: 12, 
    width: CARD_WIDTH, 
    marginBottom: 16, 
    alignItems: 'center' 
  },
  imgContainer: { 
    width: '100%', 
    height: 110, 
    borderRadius: 14, 
    backgroundColor: '#f0f0f0', 
    overflow: 'hidden', 
    marginBottom: 12 
  },
  img: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardCat: { 
    fontSize: 10, 
    color: '#a0a0a0', 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    marginBottom: 4,
    fontFamily: GlobalStyles.fontFamily
  },
  cardName: { 
    color: '#2d3436', 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 12, 
    textAlign: 'center',
    fontFamily: GlobalStyles.fontFamily
  },
  actions: { flexDirection: 'row', gap: 12 },
  btnAct: { 
    backgroundColor: '#FFFFFF', 
    padding: 8, 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  fab: { 
    position: 'absolute', 
    bottom: 30, 
    right: 24, 
    width: 56, 
    height: 56, 
    backgroundColor: '#2d3436', 
    borderRadius: 20, 
    alignItems: 'center', 
    justifyContent: 'center', 
    elevation: 4, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  modalContent: { 
    backgroundColor: '#FFFFFF', 
    width: '100%', 
    padding: 24, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24 
  },
  modalTitle: { 
    color: '#000', 
    fontSize: 17, 
    fontWeight: '600', 
    marginBottom: 20, 
    textAlign: 'center',
    fontFamily: GlobalStyles.fontFamily
  },
  input: { 
    width: '100%', 
    padding: 16, 
    marginBottom: 20, 
    backgroundColor: '#fbfbfb', 
    borderRadius: 14, 
    color: '#000',
    fontFamily: GlobalStyles.fontFamily
  },
  modalLabel: { 
    color: '#a0a0a0', 
    fontSize: 12, 
    fontWeight: '700', 
    textTransform: 'uppercase', 
    marginBottom: 12, 
    marginLeft: 4,
    fontFamily: GlobalStyles.fontFamily
  },
  modalCategoryContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 },
  miniChip: { 
    backgroundColor: '#fbfbfb', 
    paddingVertical: 10, 
    paddingHorizontal: 14, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#f0f0f0' 
  },
  miniChipActive: { backgroundColor: '#2d3436', borderColor: '#2d3436' },
  miniChipText: { color: '#a0a0a0', fontSize: 13, fontWeight: '600', fontFamily: GlobalStyles.fontFamily },
  miniChipTextActive: { color: '#FFFFFF' },
  btnSave: { 
    width: '100%', 
    padding: 16, 
    backgroundColor: '#2d3436', 
    borderRadius: 16, 
    alignItems: 'center' 
  },
  btnSaveText: { 
    fontWeight: '600', 
    color: '#FFFFFF', 
    fontSize: 15,
    fontFamily: GlobalStyles.fontFamily
  },
});