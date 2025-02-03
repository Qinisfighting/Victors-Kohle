import { useState, useEffect } from "react";
// import { Timestamp } from "firebase/firestore";
import { UserID } from "../../types";
// import { getSavingLog } from "../firebase.ts";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ThreeDots } from "react-loader-spinner";
import { formatToGerman } from "@/utils/format";
import { getSavingTotal } from "../firebase";

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
    const fetchTotalAmount = async () => {
      if (!uid) return;

      try {
        setLoading(true);
        const total = await getSavingTotal(uid);
        console.log("Running total:", total);
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching saving total:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAmount();
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
      <div className="flex justify-between items-center space-x-1 my-4 gap-2">
        <label className="font-medium text-md text-left">Zweck</label>
        <input
          type="text"
          className="w-52 p-1 border border-gray-300 rounded-lg bg-white"
        />
      </div>
      <div className="flex justify-between items-center space-x-1 my-4 gap-2">
        <label className="font-medium text-md text-left">Betrag(€)</label>
        <input
          type="number"
          className="w-52 p-1 border border-gray-300 rounded-lg bg-white"
        />
      </div>
      <div className="flex justify-between items-center space-x-1 my-4 gap-2">
        <button className="my-2 mr-2 bg-blue-500 hover:bg-blue-600 text-white font-bold p-1 w-36 rounded border-none">
          Geld einzahlen
        </button>
        <button className="my-2 bg-red-500 hover:bg-red-600 text-white font-bold p-1 w-36 rounded border-none">
          Geld entnehmen
        </button>
      </div>
    </div>
  );
};

export default Savings;
