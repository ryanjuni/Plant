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
      
      {/* Remove o cabeçalho que diz "(tabs)" */}
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />

      {/* Define o título apenas para a tela principal */}
      <Stack.Screen 
        name="index" 
        options={{ title: 'Meu Jardim' }} 
      />
      
      <Stack.Screen name="detalhes" options={{ title: 'Detalhes da Planta' }} />
      <Stack.Screen name="adicionar" options={{ title: 'Nova Planta' }} />
    </Stack>
  );
}