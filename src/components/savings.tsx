import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { UserID } from "../../types";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { ThreeDots } from "react-loader-spinner";
import { formatToGerman } from "@/utils/format";
import { AccountFlow } from "types";
import {
  getSavingLog,
  getSavingTotal,
  subtractMoneyFromSaving,
  addMoneyIntoSaving,
  updateSavingTotal,
  clearSavingLog,
  clearTotalAmount,
} from "../firebase";
import { getColumns } from "./cashFlow/columns";
import { DataTable } from "./cashFlow/data-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import warning from "@/assets/warning.png";

const Savings = () => {
  const auth = getAuth();
  const [, setUser] = useState<User | null>(null);
  const [uid, setUid] = useState<UserID | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingLog, setSavingLog] = useState<AccountFlow[]>([]);
  const [form, setForm] = useState<AccountFlow>({
    reason: "",
    amount: 0,
    isPlus: true,
    createdOn: Timestamp.fromDate(new Date()),
  });
  const isResetDisabled = totalAmount === 0;

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

  useEffect(() => {
    const fetchSavingLog = async () => {
      if (!uid) return;

      try {
        setLoading(true);
        const log = await getSavingLog(uid);
        console.log("Saving log:", log);
        setSavingLog(log);
      } catch (error) {
        console.error("Error fetching saving log:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavingLog();
  }, [uid, totalAmount]);

  const handleDeleteLogItem = (deletedItem: AccountFlow) => {
    setSavingLog((prevLog) =>
      prevLog.filter((item) => item.createdOn !== deletedItem.createdOn)
    );
    setTotalAmount(
      (prevTotal) =>
        prevTotal -
        (deletedItem.isPlus ? deletedItem.amount : -deletedItem.amount)
    );
    if (uid) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      deletedItem.isPlus
        ? updateSavingTotal(uid, -deletedItem.amount)
        : updateSavingTotal(uid, deletedItem.amount);
    }
  };

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
        />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitter = (e.nativeEvent as SubmitEvent)
      .submitter as HTMLButtonElement;

    if (!uid) return;

    const amountChange = form.amount;

    try {
      if (submitter.value === "deposit") {
        await addMoneyIntoSaving(uid, form.reason, amountChange);
        setTotalAmount((prevTotal) => prevTotal + amountChange);
        await updateSavingTotal(uid, amountChange);
      } else if (submitter.value === "withdraw") {
        await subtractMoneyFromSaving(uid, form.reason, amountChange);
        setTotalAmount((prevTotal) => prevTotal - amountChange);
        await updateSavingTotal(uid, -amountChange);
      }
    } catch (error) {
      console.error("Error updating savings:", error);
    }

    setForm({
      reason: "",
      amount: 0,
      isPlus: true,
      createdOn: Timestamp.fromDate(new Date()),
    });
  };

  const handleReset = async () => {
    if (!uid) return;

    try {
      const [logCleared, totalCleared] = await Promise.all([
        clearSavingLog(uid),
        clearTotalAmount(uid),
      ]);

      if (logCleared || totalCleared) {
        // Fetch updated data only if any reset happened
        const total = await getSavingTotal(uid);
        const log = await getSavingLog(uid);

        setTotalAmount(total);
        setSavingLog(log);
      }
    } catch (error) {
      console.error("Error resetting savings:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-start mb-4">
          <h2 className="text-gray-400">Kontostand</h2>
          <p className="text-gray-700 font-medium text-4xl">
            {formatToGerman(parseFloat(totalAmount.toFixed(2)))} €
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isResetDisabled}
              className="w-12 text-xs bg-transparent p-0 rounded-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white  hover:border-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              RESET
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                <div className="flex text-lg font-semibold justify-center items-center px-2">
                  <img className="w-10 h-10 mr-2" src={warning}></img>
                  Möchtest du wirklich alles zurücksetzen?
                </div>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Deine Kontostand wird auf 0 gesetezt und alle Einträge werden
                gelöscht.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Nein</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Ja</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between items-center space-x-1 mt-0 gap-2">
          <label className="font-medium text-md text-left" htmlFor="reason">
            Zweck
          </label>
          <input
            required
            type="text"
            id="reason"
            name="reason"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            className="w-48 p-1 border border-gray-300 rounded-lg bg-white"
          />
        </div>
        <div className="flex justify-between items-center space-x-1 my-4 gap-2">
          <label className="font-medium text-md text-left" htmlFor="amount">
            Betrag(€)
          </label>
          <input
            type="number"
            required
            id="amount"
            name="amount"
            value={form.amount || ""}
            onChange={(e) =>
              setForm({ ...form, amount: parseFloat(e.target.value) })
            }
            className="w-48 p-1 border border-gray-300 rounded-lg bg-white"
          />
        </div>

        <div className="flex justify-between items-center my-2 gap-2">
          <button
            type="submit"
            name="action"
            value="deposit"
            className="my-2 mr-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-1 w-32 rounded border-none"
          >
            + Einzahlen
          </button>
          <button
            type="submit"
            name="action"
            value="withdraw"
            className="my-2 ml-2 bg-red-500 hover:bg-red-600 text-white font-bold p-1 w-32 rounded border-none"
          >
            - Entnehmen
          </button>
        </div>
      </form>
      <div className="container mx-auto py-4 text-gray-500">
        {savingLog.length === 0 ? (
          <p>Keine Einträge vorhanden.</p>
        ) : (
          <DataTable
            columns={getColumns(uid, handleDeleteLogItem)}
            data={savingLog}
          />
        )}
      </div>
    </div>
  );
};

export default Savings;
