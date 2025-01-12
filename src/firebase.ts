import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
// const isLoggedIn = localStorage.getItem("loggedin")

export const auth = getAuth(app);
export const user = auth.currentUser;
export const db = getFirestore(app);

export default app;
// export const db = getFirestore(app);
// export const storage = getStorage(app);
// const articleRef = collection(db, "Articles");

// export async function getArticles(id?: string) {
//   const querySnapshot = await getDocs(articleRef);
//   const dataArr = querySnapshot.docs.map((doc) => ({
//     ...doc.data(),
//     id: doc.id,
//   }));
//   // console.log(dataArr)
//   return id ? dataArr.filter((item) => item.id === id)[0] : dataArr;
// }
