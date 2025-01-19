import { useState, useEffect } from "react";
// import { Timestamp } from "firebase/firestore";
import { AccountFlow, UserID } from "../../types";
import { getSavingLog } from "../firebase.ts";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const Savings = () => {
  const auth = getAuth();
  const [, setUser] = useState<User | null>(null);
  const [uid, setUid] = useState<UserID>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        if (currentUser) {
          setUid(currentUser.uid); // Save the UID for Firestore operations
        }
      } else {
        setUser(null);
        setUid(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchSavingLog = async () => {
      if (!uid) return;

      try {
        setLoading(true);
        const flow: AccountFlow[] = (await getSavingLog(uid)) || [];

        // Calculate sum of amounts
        const total = flow.reduce((acc, item) => acc + item.amount, 0);
        console.log(total);
        console.log(uid);
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching saving log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingLog();
  }, [uid]);

  if (loading) {
    return <p>Loading savings...</p>;
  }

  return (
    <div>
      <h2>Total Savings</h2>
      <p>{totalAmount.toFixed(2)} €</p>
    </div>
  );
};

export default Savings;
