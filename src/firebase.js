import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { axiosInstance } from "./axios";

// const firebaseConfig = {
//   apiKey: "AIzaSyC6RuGQyskwPx-vI9MiGFH6kSoHYP5AN4A",
//   authDomain: "kelompok-3-d7406.firebaseapp.com",
//   projectId: "kelompok-3-d7406",
//   storageBucket: "kelompok-3-d7406.appspot.com",
//   messagingSenderId: "21487527614",
//   appId: "1:21487527614:web:35983e766ae04ccd9de0ef"
// };

const firebaseConfig = {
  apiKey: "AIzaSyBItMcRG9aBg6gdyRvUB6hJ8cBiCmaWlJ0",
  authDomain: "finalproject-secondhand.firebaseapp.com",
  projectId: "finalproject-secondhand",
  storageBucket: "finalproject-secondhand.appspot.com",
  messagingSenderId: "979380492581",
  appId: "1:21487527614:web:35983e766ae04ccd9de0ef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
// save data user when logged
export const storage = getStorage(app);
export default app;

axiosInstance.interceptors.request.use(async (config) => {
  if ((auth.currentUser && !auth.currentUser.isAnonymous) || localStorage.getItem('Auth Token')) {
    config.headers['authorization'] = auth.currentUser ? await auth.currentUser.getIdToken() : localStorage.getItem('Auth Token');
  }
  return config
})