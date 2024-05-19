import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDVCLTNssHgOpTmraCib5ITCsKd84lvUAc",
  authDomain: "movieflow-admin.firebaseapp.com",
  projectId: "movieflow-admin",
  storageBucket: "movieflow-admin.appspot.com",
  messagingSenderId: "67844320544",
  appId: "1:67844320544:web:3fff3d096a549503a9fb45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);