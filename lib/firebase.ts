import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDURrUsDJys4aceDEoFiLcouMyf-eEsOMg",
  authDomain: "iot-eiei-5d26d.firebaseapp.com",
  projectId: "iot-eiei-5d26d",
  storageBucket: "iot-eiei-5d26d.firebasestorage.app",
  messagingSenderId: "284509847669",
  appId: "1:284509847669:web:d5c465ad275a491a28f83c",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
