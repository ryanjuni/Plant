// rotas do app, definidas aqui no layout para serem usadas em todas as telas
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// Importamos o Provider que criamos (certifique-se de criar o arquivo LanguageContext.tsx)
import { LanguageProvider } from './LanguageContext'; 

export default function RootLayout() {
  return (
    <LanguageProvider>
      {/* Garante que os ícones de bateria/hora fiquem escuros no fundo branco */}
      <StatusBar style="dark" />
      
      <Stack
        screenOptions={{
          // Remove a barra superior de todas as telas
          headerShown: false, 
          
          // Define o fundo padrão como branco para evitar borrões cinzas
          contentStyle: { backgroundColor: '#fff' },
          
          // Animação de deslize lateral (estilo iOS/Padrão moderno)
          animation: 'slide_from_right',
        }}>
        
        {/* Telas principais */}
        <Stack.Screen name="index" />
        <Stack.Screen name="Login" />
        <Stack.Screen name="Alertas" />
        <Stack.Screen name="Relatorio" />
        <Stack.Screen name="Config" />
        <Stack.Screen name="Cadastrar" />
        <Stack.Screen name="Analise" />
        <Stack.Screen name="Usuario" />
        <Stack.Screen name="Perfil" />
        <Stack.Screen name="Idioma" />
      </Stack>
    </LanguageProvider>
  );
}