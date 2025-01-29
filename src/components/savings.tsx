import { useState, useEffect } from "react";
// import { Timestamp } from "firebase/firestore";
import { AccountFlow, UserID } from "../../types";
import { getSavingLog } from "../firebase.ts";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ThreeDots } from "react-loader-spinner";
import { formatToGerman } from "@/utils/format";

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
    return (
      <div className="flex justify-center items-center h-80">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="blue"
          radius="8"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="text-start">
        <h2 className="text-gray-400">Kontostand</h2>
        <p className="text-gray-700 font-medium text-4xl">
          {formatToGerman(parseFloat(totalAmount.toFixed(2)))} €
        </p>
      </div>
    </div>
  );
};

export default Savings;
