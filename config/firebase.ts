// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqHTpyeW1mY2Xty1L4kbqLam9OwruaiSo",
  authDomain: "authenticationprototype-713a2.firebaseapp.com",
  projectId: "authenticationprototype-713a2",
  storageBucket: "authenticationprototype-713a2.firebasestorage.app",
  messagingSenderId: "400541491719",
  appId: "1:400541491719:web:6a3ca657e044dbddf380a2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
