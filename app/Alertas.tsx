import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function ModalScreen() {
  return (
    // Substituímos ThemedView por View
    <View style={styles.container}>
      {/* Substituímos ThemedText por Text */}
      <Text style={styles.titulo}>Este é um modal</Text>
      
      <Link href="/" style={styles.link}>
        <Text style={styles.textoLink}>Voltar para o início</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  textoLink: {
    color: '#007AFF',
    fontSize: 16,
  },
});