// src/firebaseConfig.js or utils/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB4_PmnA2aP9R8CWpRmOGJw7K5Lc02920U",
  authDomain: "bitsbids-310e1.firebaseapp.com",
  projectId: "bitsbids-310e1",
  storageBucket: "bitsbids-310e1.appspot.com",
  messagingSenderId: "765988563782",
  appId: "1:765988563782:web:e5f2da7b4681989221d347"
};

const app = initializeApp(firebaseConfig); 
const storage = getStorage(app);

export { storage };
