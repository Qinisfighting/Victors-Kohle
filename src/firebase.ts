import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { AccountFlow } from "types";

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

export async function addFlowItem(uid: string | null, currentAmount: number) {
  const newFlowItem = {
    reason: "Tachengeld",
    amount: parseFloat(currentAmount.toFixed(2)),
    isPlus: true,
    createdOn: Timestamp.now(),
  };
  if (!uid) return;
  try {
    const docRef = doc(db, "users", uid, "savingLog", "data");

    const docSnap = await getDoc(docRef);
    const flowItemList = docSnap.exists() ? docSnap.data().flow || [] : [];

    // Check if the item already exists based on timestamp comparison
    const exists = flowItemList.some(
      (item: AccountFlow) =>
        item.createdOn.toDate().getTime() ===
        newFlowItem.createdOn.toDate().getTime()
    );

    if (!exists) {
      await updateDoc(docRef, {
        flow: arrayUnion(newFlowItem),
      });
      console.log("Saving log updated after pig click.");
    } else {
      console.log("Entry already exists, skipping update.");
    }
  } catch (error) {
    console.error("Error updating saving log in Firestore:", error);
  }
}

export async function getSavingLog(uid: string | null) {
  if (!uid) return null;
  try {
    const docRef = doc(db, "users", uid, "savingLog", "data");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().flow || [];
    } else {
      console.log("No saving log found.");
      return [];
    }
  } catch (error) {
    console.error("Error retrieving saving log from Firestore:", error);
    return null;
  }
}

export default app;
