// rotas do app, definidas aqui no layout para serem usadas em todas as telas
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        
        headerShown: false, 
        contentStyle: { backgroundColor: '#fff' },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Login" />
      <Stack.Screen name="Alertas" />
      <Stack.Screen name="Relatorio" />
      <Stack.Screen name="Config" />
      <Stack.Screen name="Cadastrar" />
      <Stack.Screen name="Analise" />
      <Stack.Screen name="Usuario" />
    </Stack>
  );
}