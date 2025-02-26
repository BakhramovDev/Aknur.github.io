import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7tFyRPBSlBIUFszn-V3rqCS-RQE4L9Y0",
  authDomain: "aknur-messenger-895fe.firebaseapp.com",
  databaseURL: "https://aknur-messenger-895fe-default-rtdb.firebaseio.com",
  projectId: "aknur-messenger-895fe",
  storageBucket: "aknur-messenger-895fe.firebasestorage.app",
  messagingSenderId: "870773064716",
  appId: "1:870773064716:web:a885ede222b98c3f4f1a29",
  measurementId: "G-5T5SY1BGL3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

createApp(App).use(router).mount('#app')
