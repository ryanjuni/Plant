import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations: any = {
  pt: {
    // Geral e Index
    welcome: "Olá, bem-vindo!",
    my_cultivation: "Meu Cultivo",
    save: "Confirmar",
    watermelon_name: "Melancia",
    syncing: "Sincronizando...",
    searching: "Buscando...",
    
    // Status e Dicas de Cultivo (Onde estava o bug)
    ideal_cond: "Planta em condições ideais.",
    water_now: "Solo secando rápido! Regue agora.",
    high_humidity: "Muita umidade. Cuidado com fungos.",
    cold_alert: "Frio detectado. Proteja a muda.",
    low: "Baixo",
    medium: "Médio",
    high: "ALTO",
    excellent: "Excelente",
    moderate: "Moderada",
    low_light: "Baixa",

    // Clima (Traduzindo o retorno da API)
    clear_sky: "Céu Limpo",
    few_clouds: "Poucas Nuvens",
    scattered_clouds: "Nuvens Esparsas",
    broken_clouds: "Nublado",
    shower_rain: "Chuva Passageira",
    rain: "Chuvoso",
    thunderstorm: "Tempestade",
    mist: "Névoa",

    // Configurações
    settings_title: "Configurações",
    account_section: "CONTA",
    profile_user: "Perfil do Usuário",
    horta_section: "HORTA DIGITAL",
    notifications: "Notificações",
    sensor_data: "Dados do Sensor",
    general_section: "GERAL",
    language: "Idioma",
    about: "Sobre o Projeto",
    logout: "Encerrar Sessão",
    language_select: "Selecione o idioma do aplicativo",

    // Análise e Gráficos
    analysis_title: "Análise de Cultivo",
    weekly: "Semanal",
    monthly: "Mensal",
    avg_ph: "Média pH",
    nutrients: "Nutrientes",
    efficiency: "Eficiência",
    balanced: "Equilibrado",
    stable: "Estável",
    mon: "Seg", tue: "Ter", wed: "Qua", thu: "Qui", fri: "Sex", sat: "Sab", sun: "Dom",
    jan: "Jan", feb: "Fev", mar: "Mar", apr: "Abr", may: "Mai", jun: "Jun",

    // Relatório
    report_title: "RELATÓRIO",
    system_active: "SISTEMA ATIVO",
    today_analysis: "ANÁLISE DE HOJE",
    updated_at: "Atualizado em",
    download_pdf: "Baixar PDF",
    status_ok: "Status: O sistema de irrigação automática está operando normalmente. Solo estável.",
    light: "Luz",
    tank: "Tanque",

    // Dados do Sensor
    soil_moisture: "Umidade do Solo",
    water_level: "Nível do Reservatório",
    last_update: "Última atualização",
    sensor_status: "Status do Sensor",
    connected: "Conectado",
    temp_env: "CALOR AMBIENTE",
    solar_light: "LUZ SOLAR",
    air_humidity: "UMIDADE AR",
    drought_risk: "RISCO DE SECA",

    // Sobre
    about_description: "A Horta Digital é uma plataforma inteligente focada no monitoramento doméstico de cultivos, utilizando tecnologia IoT para garantir que suas plantas recebam o cuidado ideal.",
    team: "Equipe de Desenvolvimento",
    version: "Versão"
  },
  en: {
    welcome: "Hello, welcome!",
    my_cultivation: "My Cultivation",
    save: "Confirm",
    watermelon_name: "Watermelon",
    syncing: "Syncing...",
    searching: "Searching...",
    ideal_cond: "Plant in ideal conditions.",
    water_now: "Soil drying fast! Water now.",
    high_humidity: "High humidity. Watch for fungi.",
    cold_alert: "Cold detected. Protect the seedling.",
    low: "Low",
    medium: "Medium",
    high: "HIGH",
    excellent: "Excellent",
    moderate: "Moderate",
    low_light: "Low",
    clear_sky: "Clear Sky",
    few_clouds: "Few Clouds",
    scattered_clouds: "Scattered Clouds",
    broken_clouds: "Cloudy",
    shower_rain: "Shower Rain",
    rain: "Rainy",
    thunderstorm: "Thunderstorm",
    mist: "Mist",
    settings_title: "Settings",
    account_section: "ACCOUNT",
    profile_user: "User Profile",
    horta_section: "DIGITAL GARDEN",
    notifications: "Notifications",
    sensor_data: "Sensor Data",
    general_section: "GENERAL",
    language: "Language",
    about: "About the Project",
    logout: "Logout",
    language_select: "Select the app language",
    analysis_title: "Crop Analysis",
    weekly: "Weekly",
    monthly: "Monthly",
    avg_ph: "Average pH",
    nutrients: "Nutrients",
    efficiency: "Efficiency",
    balanced: "Balanced",
    stable: "Stable",
    mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
    jan: "Jan", feb: "Feb", mar: "Mar", apr: "Apr", may: "May", jun: "Jun",
    report_title: "REPORT",
    system_active: "SYSTEM ACTIVE",
    today_analysis: "TODAY'S ANALYSIS",
    updated_at: "Updated on",
    download_pdf: "Download PDF",
    status_ok: "Status: The automatic irrigation system is operating normally. Soil stable.",
    light: "Light",
    tank: "Tank",
    soil_moisture: "Soil Moisture",
    water_level: "Water Level",
    last_update: "Last update",
    sensor_status: "Sensor Status",
    connected: "Connected",
    temp_env: "AMBIENT HEAT",
    solar_light: "SOLAR LIGHT",
    air_humidity: "AIR HUMIDITY",
    drought_risk: "DROUGHT RISK",
    about_description: "Horta Digital is a smart platform focused on home crop monitoring, using IoT technology to ensure your plants receive ideal care.",
    team: "Development Team",
    version: "Version"
  },
  es: {
    welcome: "¡Hola, bienvenido!",
    my_cultivation: "Mi Cultivo",
    save: "Confirmar",
    watermelon_name: "Sandía",
    syncing: "Sincronizando...",
    searching: "Buscando...",
    ideal_cond: "Planta en condiciones ideales.",
    water_now: "¡Suelo seco! Riegue ahora.",
    high_humidity: "Mucha humedad. Cuidado con hongos.",
    cold_alert: "Frío detectado. Proteja la planta.",
    low: "Bajo",
    medium: "Medio",
    high: "ALTO",
    excellent: "Excelente",
    moderate: "Moderada",
    low_light: "Baja",
    clear_sky: "Cielo Despejado",
    few_clouds: "Pocas Nubes",
    scattered_clouds: "Nubes Dispersas",
    broken_clouds: "Nublado",
    shower_rain: "Lluvia Ligera",
    rain: "Lluvia",
    thunderstorm: "Tormenta",
    mist: "Neblina",
    settings_title: "Ajustes",
    account_section: "CUENTA",
    profile_user: "Perfil de Usuario",
    horta_section: "HUERTO DIGITAL",
    notifications: "Notificaciones",
    sensor_data: "Datos del Sensor",
    general_section: "GENERAL",
    language: "Idioma",
    about: "Sobre el Proyecto",
    logout: "Cerrar Sesión",
    language_select: "Seleccione el idioma de la aplicación",
    analysis_title: "Análisis de Cultivo",
    weekly: "Semanal",
    monthly: "Mensual",
    avg_ph: "Promedio pH",
    nutrients: "Nutrientes",
    efficiency: "Eficiencia",
    balanced: "Equilibrado",
    stable: "Estable",
    mon: "Lun", tue: "Mar", wed: "Mié", thu: "Jue", fri: "Vie", sat: "Sáb", sun: "Dom",
    jan: "Ene", feb: "Feb", mar: "Mar", apr: "Abr", may: "May", jun: "Jun",
    report_title: "REPORTE",
    system_active: "SISTEMA ACTIVO",
    today_analysis: "ANÁLISE DE HOY",
    updated_at: "Actualizado el",
    download_pdf: "Descargar PDF",
    status_ok: "Estado: El sistema de riego automático funciona con normalidad. Suelo estable.",
    light: "Luz",
    tank: "Tanque",
    soil_moisture: "Humedad del Suelo",
    water_level: "Nivel del Tanque",
    last_update: "Última actualización",
    sensor_status: "Estado del Sensor",
    connected: "Conectado",
    temp_env: "CALOR AMBIENTE",
    solar_light: "LUZ SOLAR",
    air_humidity: "HUMEDAD AIRE",
    drought_risk: "RIESGO DE SEQUÍA",
    about_description: "Horta Digital es una plataforma inteligente enfocada en el monitoreo doméstico de cultivos, utilizando tecnología IoT para asegurar que sus plantas reciban el cuidado ideal.",
    team: "Equipo de Desarrollo",
    version: "Versión"
  },
  fr: {
    welcome: "Bonjour, bienvenue!",
    my_cultivation: "Ma Culture",
    save: "Confirmer",
    watermelon_name: "Pastèque",
    syncing: "Synchronisation...",
    searching: "Recherche...",
    ideal_cond: "Plante en conditions idéales.",
    water_now: "Sol sec! Arrosez maintenant.",
    high_humidity: "Forte humidité. Attention aux champignons.",
    cold_alert: "Froid détecté. Protégez le plant.",
    low: "Bas",
    medium: "Moyen",
    high: "ÉLEVÉ",
    excellent: "Excellente",
    moderate: "Modérée",
    low_light: "Basse",
    clear_sky: "Ciel Dégagé",
    few_clouds: "Quelques Nuages",
    scattered_clouds: "Nuages Épars",
    broken_clouds: "Nuageux",
    shower_rain: "Pluie Légère",
    rain: "Pluie",
    thunderstorm: "Orage",
    mist: "Brume",
    settings_title: "Paramètres",
    account_section: "COMPTE",
    profile_user: "Profil de l'Utilisateur",
    horta_section: "JARDIN NUMÉRIQUE",
    notifications: "Notifications",
    sensor_data: "Données du Capteur",
    general_section: "GÉNÉRAL",
    language: "Langue",
    about: "À propos du Projet",
    logout: "Se Déconnecter",
    language_select: "Sélectionnez la langue de l'application",
    analysis_title: "Analyse de Culture",
    weekly: "Hebdomadaire",
    monthly: "Mensuel",
    avg_ph: "pH Moyen",
    nutrients: "Nutriments",
    efficiency: "Efficacité",
    balanced: "Équilibré",
    stable: "Stable",
    mon: "Lun", tue: "Mar", wed: "Mer", thu: "Jeu", fri: "Ven", sat: "Sam", sun: "Dim",
    jan: "Jan", feb: "Fév", mar: "Mar", apr: "Avr", may: "Mai", jun: "Juin",
    report_title: "RAPPORT",
    system_active: "SYSTÈME ACTIF",
    today_analysis: "ANALYSE D'AUJOURD'HUI",
    updated_at: "Mis à jour le",
    download_pdf: "Télécharger PDF",
    status_ok: "Statut: Le système d'irrigation automatique fonctionne normalement. Sol stable.",
    light: "Lumière",
    tank: "Réservoir",
    soil_moisture: "Humidité du Sol",
    water_level: "Nivel du Réservoir",
    last_update: "Dernière mise à jour",
    sensor_status: "État du Capteur",
    connected: "Connecté",
    temp_env: "CHALEUR AMBIANTE",
    solar_light: "LUMIÈRE SOLAIRE",
    air_humidity: "HUMIDITÉ DE L'AIR",
    drought_risk: "RISQUE DE SÉCHERESSE",
    about_description: "Horta Digital est une plateforme intelligente axée sur la surveillance des cultures domestiques, utilisant la technologie IoT pour garantir que vos plantes reçoivent les soins idéaux.",
    team: "Équipe de Développement",
    version: "Version"
  }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: any) => {
  const [locale, setLocale] = useState('pt');

  useEffect(() => {
    const loadLang = async () => {
      const saved = await AsyncStorage.getItem('@app_language');
      if (saved) setLocale(saved);
    };
    loadLang();
  }, []);

  const changeLanguage = async (lang: string) => {
    setLocale(lang);
    await AsyncStorage.setItem('@app_language', lang);
  };

  const t = (key: string) => {
    if (!translations[locale] || !translations[locale][key]) {
      // Se não achar a chave, tenta no pt, se não, retorna a própria chave (evita mostrar em branco)
      return translations['pt'][key] || key; 
    }
    return translations[locale][key];
  };

  return (
    <LanguageContext.Provider value={{ locale, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);