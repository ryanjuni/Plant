import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Meu Jardim 🌿</Text>
      
      {/* Botão de exemplo para navegar */}
      <TouchableOpacity 
        style={styles.botao} 
        onPress={() => router.push('/Cadastrar')}
      >
        <Text style={styles.textoBotao}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2D5A27',
    marginBottom: 30,
  },
  botao: {
    backgroundColor: '#2D5A27',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
