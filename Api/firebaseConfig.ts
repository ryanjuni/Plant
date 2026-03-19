import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Substitua os valores abaixo pelos que aparecem no seu Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-SUA-CHAVE-REAL-AQUI-123", 
  authDomain: "plant-upx-f0a1.firebaseapp.com",
  // A databaseURL é fundamental para o Realtime Database aparecer no app
  databaseURL: "https://plant-upx-f0a1-default-rtdb.firebaseio.com/", 
  projectId: "plant-upx-f0a1",
  storageBucket: "plant-upx-f0a1.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:a1b2c3d4e5f6g7h8"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o banco de dados (db) para ser usado no seu index.tsx
export const db = getDatabase(app);