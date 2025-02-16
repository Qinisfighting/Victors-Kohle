import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
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

export async function addWeeklyLeftIntoSaving(
  uid: string | null,
  currentAmount: number
) {
  if (!uid) return;

  const newFlowItem = {
    reason: "Tachengeld",
    amount: parseFloat(currentAmount.toFixed(2)),
    isPlus: true,
    createdOn: Timestamp.now(),
  };

  try {
    const docRef = doc(db, "users", uid, "savingLog", "data");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { flow: [newFlowItem] });
      console.log("Saving log initialized with first entry.");
      return;
    }

    const flowItemList = docSnap.data().flow || [];

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
    await updateSavingTotal(uid, newFlowItem.amount);
  } catch (error) {
    console.error("Error updating saving log in Firestore:", error);
  }
}

export async function addMoneyIntoSaving(
  uid: string | null,
  reason: string,
  plusAmount: number
) {
  if (!uid) return;
  const plusAmountAjusted = parseFloat(plusAmount.toString().replace(",", "."));
  const newFlowItem = {
    reason: reason,
    amount: parseFloat(plusAmountAjusted.toFixed(2)),
    isPlus: true,
    createdOn: Timestamp.now(),
  };

  try {
    const docRef = doc(db, "users", uid, "savingLog", "data");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { flow: [newFlowItem] });
      console.log("Saving log initialized with first entry.");
      return;
    }

    const flowItemList = docSnap.data().flow || [];

    const exists = flowItemList.some(
      (item: AccountFlow) =>
        item.createdOn.toDate().getTime() ===
        newFlowItem.createdOn.toDate().getTime()
    );

    if (!exists) {
      await updateDoc(docRef, {
        flow: arrayUnion(newFlowItem),
      });
      console.log("Saving log updated after plus click.");
    } else {
      console.log("Entry already exists, skipping update.");
    }
  } catch (error) {
    console.error("Error updating saving log in Firestore:", error);
  }
}

export async function subtractMoneyFromSaving(
  uid: string | null,
  reason: string,
  minusAmount: number
) {
  if (!uid) return;
  const minusAmountAjusted = parseFloat(
    minusAmount.toString().replace(",", ".")
  );

  const newFlowItem = {
    reason: reason,
    amount: parseFloat(minusAmountAjusted.toFixed(2)),
    isPlus: false,
    createdOn: Timestamp.now(),
  };

  try {
    const docRef = doc(db, "users", uid, "savingLog", "data");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, { flow: [newFlowItem] });
      console.log("Saving log initialized with first entry.");
      return;
    }

    const flowItemList = docSnap.data().flow || [];

    const exists = flowItemList.some(
      (item: AccountFlow) =>
        item.createdOn.toDate().getTime() ===
        newFlowItem.createdOn.toDate().getTime()
    );

    if (!exists) {
      await updateDoc(docRef, {
        flow: arrayUnion(newFlowItem),
      });
      console.log("Saving log updated after plus click.");
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

export const getSavingTotal = async (uid: string): Promise<number> => {
  try {
    const totalDocRef = doc(db, "users", uid, "amount", "savingTotalAmountDoc");
    const docSnap = await getDoc(totalDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.total ?? 0;
    } else {
      await setDoc(totalDocRef, { total: 0 });
      return 0;
    }
  } catch (error) {
    console.error("Error fetching saving total: ", error);
    throw error;
  }
};

export async function updateSavingTotal(
  uid: string,
  delta: number
): Promise<void> {
  if (!uid) return;

  const totalDocRef = doc(db, "users", uid, "amount", "savingTotalAmountDoc");

  try {
    await runTransaction(db, async (transaction) => {
      const totalDoc = await transaction.get(totalDocRef);

      if (!totalDoc.exists()) {
        // If the document does not exist, initialize it with the delta.
        transaction.set(totalDocRef, { total: delta });
      } else {
        const currentTotal = totalDoc.data().total || 0;
        transaction.update(totalDocRef, { total: currentTotal + delta });
      }
    });
    console.log(`Updated saving total by ${delta}`);
  } catch (error) {
    console.error("Error updating saving total:", error);
    throw error;
  }
}

export default app;
