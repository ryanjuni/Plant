import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ImageBackground, 
  TextInput, 
  SafeAreaView, 
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen() {
  const router = useRouter();
  
  // ESTADOS DE CONTROLE
  const [abaAtiva, setAbaAtiva] = useState<'login' | 'cadastro'>('login');
  const [isRecuperando, setIsRecuperando] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');
  const [erroMensagem, setErroMensagem] = useState('');

  // ESTADOS DOS CAMPOS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const simpleEncrypt = (text: string) => {
    return btoa(text); 
  };

  const trocarAba = (aba: 'login' | 'cadastro') => {
    setAbaAtiva(aba);
    setIsRecuperando(false); 
    setEmail('');
    setPassword('');
    setFullName('');
    setErroMensagem(''); 
  };

  const irParaHome = () => {
    setModalVisivel(false);
    try {
      router.replace('/' as any);
    } catch (e) {
      if (Platform.OS === 'web') {
        window.location.href = '/';
      }
    }
  };

  // LÓGICA DE LOGIN
  const handleLogin = async () => {
    setErroMensagem('');
    if (!email.trim() || !password.trim()) {
      setErroMensagem('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);

    try {
      if (email.trim() === 'teste' && password === 'teste') {
        await AsyncStorage.setItem('@HortaDigital:currentUser', JSON.stringify({ fullName: "Usuário Teste", email: "teste" }));
        setLoading(false);
        setMensagemSucesso('Bem-vindo de volta! Seu login foi validado.');
        setModalVisivel(true); 
        return;
      }

      const userKey = `@HortaDigital:${email.toLowerCase().trim()}`;
      const userDataString = await AsyncStorage.getItem(userKey);

      if (userDataString === null) {
        setErroMensagem('Usuário não encontrado. Verifique o email ou cadastre-se.');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      if (userData.password !== simpleEncrypt(password)) {
        setErroMensagem('Senha incorreta.');
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem('@HortaDigital:currentUser', JSON.stringify(userData));
      setLoading(false);
      setMensagemSucesso('Bem-vindo de volta! Seu login foi validado.');
      setModalVisivel(true); 

    } catch (error) {
      setLoading(false);
      setErroMensagem('Ocorreu um problema ao tentar logar.');
    }
  };

  // LÓGICA DE CADASTRO
  const handleRegister = async () => {
    setErroMensagem('');
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErroMensagem('Por favor, preencha todos os campos.');
      return;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setErroMensagem('Por favor, digite um email válido.');
      return;
    }
    setLoading(true);

    try {
      const userKey = `@HortaDigital:${email.toLowerCase().trim()}`;
      const existingUser = await AsyncStorage.getItem(userKey);

      if (existingUser !== null) {
        setErroMensagem('Este email já está cadastrado.');
        setLoading(false);
        return;
      }

      const newUser = {
        fullName: fullName.trim(),
        email: email.toLowerCase().trim(),
        password: simpleEncrypt(password), 
        createdAt: new Date().toISOString()
      };

      await AsyncStorage.setItem(userKey, JSON.stringify(newUser));
      setLoading(false);
      
      setMensagemSucesso('Seu registro foi efetuado com sucesso!');
      setModalVisivel(true);

    } catch (error) {
      setLoading(false);
      setErroMensagem('Ocorreu um erro ao salvar o usuário.');
    }
  };

  // LÓGICA DE RECUPERAÇÃO DE SENHA
  const handleRecover = async () => {
    setErroMensagem('');
    if (!email.trim() || !password.trim()) {
      setErroMensagem('Digite seu e-mail e a NOVA senha desejada.');
      return;
    }
    setLoading(true);

    try {
      const userKey = `@HortaDigital:${email.toLowerCase().trim()}`;
      const userDataString = await AsyncStorage.getItem(userKey);

      if (userDataString === null) {
        setErroMensagem('E-mail não encontrado em nosso sistema.');
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      userData.password = simpleEncrypt(password);

      await AsyncStorage.setItem(userKey, JSON.stringify(userData));
      
      setLoading(false);
      setMensagemSucesso('Sua senha foi alterada com sucesso! Faça o login.');
      setModalVisivel(true);

    } catch (error) {
      setLoading(false);
      setErroMensagem('Ocorreu um erro ao redefinir a senha.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          
          <ImageBackground 
            source={{ uri: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=800' }} 
            style={styles.headerVisual}
          >
            <View style={styles.curveOverlay} />
          </ImageBackground>

          <View style={styles.formContainer}>
            
            {/* ABAS DE SELEÇÃO */}
            <View style={styles.abasContainer}>
              <TouchableOpacity style={abaAtiva === 'login' ? styles.abaAtiva : styles.abaInativa} onPress={() => trocarAba('login')}>
                <Text style={abaAtiva === 'login' ? styles.abaTextoAtivo : styles.abaTextoInativo}>Entrar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={abaAtiva === 'cadastro' ? styles.abaAtiva : styles.abaInativa} onPress={() => trocarAba('cadastro')}>
                <Text style={abaAtiva === 'cadastro' ? styles.abaTextoAtivo : styles.abaTextoInativo}>Cadastrar</Text>
              </TouchableOpacity>
            </View>

            {/* TÍTULO DINÂMICO - TRADUZIDO AQUI */}
            <Text style={styles.title}>
              {isRecuperando ? 'Redefinir Senha' : (abaAtiva === 'login' ? 'Bem-vindo de Volta' : 'Criar Conta')}
            </Text>
            <Text style={styles.subtitle}>
              {isRecuperando ? 'Digite seu e-mail para alterar sua senha' : (abaAtiva === 'login' ? 'Faça login na sua conta' : 'Registre-se para começar')}
            </Text>
            
            {abaAtiva === 'cadastro' && (
              <TextInput style={styles.input} placeholder="Nome Completo" value={fullName} onChangeText={setFullName} placeholderTextColor="#888" />
            )}

            <TextInput 
              style={styles.input} 
              placeholder="usuario@email.com" 
              value={email} 
              onChangeText={setEmail} 
              placeholderTextColor="#888" 
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput 
              style={styles.input} 
              placeholder={isRecuperando ? "Nova Senha" : "Senha"} 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={true} 
              placeholderTextColor="#888" 
            />

            {/* LINK COMPLEMENTAR DE RECUPERAÇÃO */}
            {abaAtiva === 'login' && (
              <TouchableOpacity 
                style={styles.esqueceuSenhaBtn} 
                onPress={() => {
                  setErroMensagem('');
                  setIsRecuperando(!isRecuperando);
                }}
              >
                <Text style={styles.esqueceuSenhaText}>
                  {isRecuperando ? 'Voltar para o Login' : 'Esqueceu a senha?'}
                </Text>
              </TouchableOpacity>
            )}

            {/* AVISO DE ERRO VISUAL */}
            {erroMensagem !== '' && (
              <View style={styles.erroBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color="#ff4757" />
                <Text style={styles.erroTexto}>{erroMensagem}</Text>
              </View>
            )}
            
            {/* BOTÃO PRINCIPAL DINÂMICO - TRADUZIDO AQUI */}
            <Pressable 
              style={({ pressed }) => [
                styles.btnSubmit,
                pressed && { opacity: 0.8 },
                loading && styles.btnSubmitLoading
              ]} 
              onPress={() => {
                if (isRecuperando) handleRecover();
                else if (abaAtiva === 'login') handleLogin();
                else handleRegister();
              }} 
              disabled={loading}
            >
              <Text style={styles.btnSubmitText}>
                {loading ? 'Aguarde...' : (
                  isRecuperando ? 'Atualizar Senha' : (abaAtiva === 'login' ? 'Entrar' : 'Cadastrar')
                )}
              </Text>
            </Pressable>
            
          </View>
        </View>

        {/* JANELA FLUTUANTE SIMULADA */}
        {modalVisivel && (
          <View style={styles.modalFundo}>
            <View style={styles.modalConteudo}>
              <MaterialCommunityIcons 
                name={abaAtiva === 'login' && !isRecuperando ? "emoticon-happy-outline" : "check-circle"} 
                size={65} 
                color="#27ae60" 
              />
              <Text style={styles.modalTitulo}>Sucesso!</Text>
              <Text style={styles.modalTexto}>{mensagemSucesso}</Text>
              
              <TouchableOpacity 
                style={styles.btnModalOk} 
                onPress={() => {
                  if (abaAtiva === 'login' && !isRecuperando) {
                    irParaHome();
                  } else {
                    setModalVisivel(false); 
                    trocarAba('login'); 
                  }
                }}
              >
                <Text style={styles.btnModalOkText}>
                  {abaAtiva === 'login' && !isRecuperando ? 'Entrar no App' : 'Ir para o Login'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerVisual: { height: 180, width: '100%', justifyContent: 'flex-end' },
  curveOverlay: { height: 40, backgroundColor: '#FFFFFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, width: '100%' },
  formContainer: { flex: 1, paddingHorizontal: 35, backgroundColor: '#FFFFFF' },
  
  abasContainer: { flexDirection: 'row', marginBottom: 25, backgroundColor: '#f0f4f1', borderRadius: 15, padding: 5 },
  abaAtiva: { flex: 1, backgroundColor: '#FFFFFF', paddingVertical: 12, borderRadius: 12, alignItems: 'center', elevation: 2 },
  abaInativa: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  abaTextoAtivo: { color: '#27ae60', fontWeight: '700', fontSize: 14 },
  abaTextoInativo: { color: '#888', fontWeight: '600', fontSize: 14 },

  title: { fontSize: 28, color: '#111111', fontWeight: '800' },
  subtitle: { color: '#888888', fontSize: 14, marginTop: 5, marginBottom: 25 },
  input: { width: '100%', padding: 16, marginBottom: 15, backgroundColor: '#f0f4f1', borderRadius: 15, fontSize: 16, color: '#333' },
  
  esqueceuSenhaBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -5 },
  esqueceuSenhaText: { color: '#27ae60', fontSize: 13, fontWeight: '700' },

  erroBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff1f1', padding: 12, borderRadius: 10, marginBottom: 15 },
  erroTexto: { color: '#ff4757', fontSize: 13, fontWeight: '600', marginLeft: 8 },

  btnSubmit: { backgroundColor: '#27ae60', width: '100%', padding: 18, borderRadius: 15, alignItems: 'center', marginTop: 10, elevation: 3, cursor: 'pointer' as any },
  btnSubmitLoading: { backgroundColor: '#81c784' },
  btnSubmitText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  
  modalFundo: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', zIndex: 9999 },
  modalConteudo: { width: '85%', maxWidth: 400, backgroundColor: '#FFFFFF', borderRadius: 25, padding: 30, alignItems: 'center', elevation: 10 },
  modalTitulo: { fontSize: 22, fontWeight: '800', color: '#111', marginTop: 15 },
  modalTexto: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, marginBottom: 25, lineHeight: 20 },
  btnModalOk: { backgroundColor: '#27ae60', paddingVertical: 16, paddingHorizontal: 30, borderRadius: 15, width: '100%', alignItems: 'center', cursor: 'pointer' as any },
  btnModalOkText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 }
});