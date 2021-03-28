import firebase from "firebase";
import "firebase/firestore"
const firebaseApp = firebase.initializeApp({

  apiKey: "AIzaSyD5ABBMqZA2lKJiikBCSXcv91m5Vegf4_A",
  authDomain: "instagram-clone-app-108ab.firebaseapp.com",
  projectId: "instagram-clone-app-108ab",
  storageBucket: "instagram-clone-app-108ab.appspot.com",
  messagingSenderId: "1011388323126",
  appId: "1:1011388323126:web:9451b0a319fd39cececf97",
  measurementId: "G-LL05VX15ZN"

});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebase.storage();
export const firestore = firebase.firestore()
export { db, auth, storage };
