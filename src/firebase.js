import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA63p-VjVv977OrhE7_BwwHjwsxtmBJGa4",
  authDomain: "edumatrix-65d7e.firebaseapp.com",
  projectId: "edumatrix-65d7e",
  storageBucket: "edumatrix-65d7e.firebasestorage.app",
  messagingSenderId: "712607432245",
  appId: "1:712607432245:web:92d1f5666f010d3dc33b7c",
  measurementId: "G-M8SYL9JT94"
  };

const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {auth,db,storage};