import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2D5A27',
        },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}>
      {/* IMPORTANTE: Remova a linha que tinha name="(tabs)" 
        Agora as telas são listadas diretamente pelo nome do arquivo
      */}
      <Stack.Screen name="index" options={{ title: 'Meu Jardim' }} />
      <Stack.Screen name="Login" options={{ title: 'Login' }} />
      <Stack.Screen name="Alertas" options={{ title: 'Alertas' }} />
      <Stack.Screen name="Relatorio" options={{ title: 'Relatório' }} />
      <Stack.Screen name="Config" options={{ title: 'Configurações' }} />
      <Stack.Screen name="Cadastrar" options={{ title: 'Nova Planta' }} />
      <Stack.Screen name="Analise" options={{ title: 'Análise' }} />
      <Stack.Screen name="Usuario" options={{ title: 'Usuário' }} />
    </Stack>
  );
}   
