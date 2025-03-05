import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCJ06FBXspi6G8q8OSUvaZDGYQEMTeMsFQ",
    authDomain: "edumatrix-nxtgen.firebaseapp.com",
    projectId: "edumatrix-nxtgen",
    storageBucket: "edumatrix-nxtgen.firebasestorage.app",
    messagingSenderId: "79997998805",
    appId: "1:79997998805:web:4441c591fa92170064345c"
  };

const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
const auth = getAuth(app);

export {auth,db};