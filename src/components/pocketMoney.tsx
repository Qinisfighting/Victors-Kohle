import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import monster from "@/assets/monster.png";
import balloon from "@/assets/balloon.png";
import coinincrease from "@/assets/coinincrease.png";
import { Timestamp } from "firebase/firestore";
import { TGFormData, UserID } from "../../types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { addWeeklyLeftIntoSaving, db } from "../firebase.ts";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { formatToGerman } from "@/utils/format";
import { useToast } from "@/hooks/use-toast";
import { getSavingTotal } from "../firebase";

const PocketMoney = () => {
  const weekdays = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
  ];
  const auth = getAuth();
  const [, setUser] = useState<User | null>(null);
  const [uid, setUid] = useState<UserID>(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [dailyExpense, setDailyExpense] = useState<string>("0");
  const [result, setResult] = useState<string>("0");
  const [isResultCorrect, setIsResultCorrect] = useState<boolean>(false);
  const [startingAmount, setStartingAmount] = useState<string>("0");
  const [currentAmount, setCurrentAmount] = useState(0);
  const [expensesList, setExpensesList] = useState<TGFormData[]>([
    { day: "", expense: null, createdOn: Timestamp.now() },
  ]);
  const { width, height } = useWindowSize();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
  const collectionName = "amount";
  const documentId = "weeklyStartingAmountDoc";
  const { toast } = useToast();
  const [totalAmount, setTotalAmount] = useState<number>(0);

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
    const today = new Date().toLocaleDateString("de-DE", { weekday: "long" });
    setSelectedDay(today);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResultCorrect) {
      timer = setTimeout(() => {
        setIsResultCorrect(false);
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isResultCorrect]);

  // Fetch `startingAmount`
  useEffect(() => {
    if (uid) {
      const fetchStartingAmount = async () => {
        try {
          const docRef = doc(db, "users", uid, collectionName, documentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as { startingAmount: string };
            setStartingAmount(data.startingAmount);
            setCurrentAmount(parseFloat(data.startingAmount));
          } else {
            console.log("No such document for user!");
          }
        } catch (error) {
          console.error("Error fetching starting amount:", error);
        }
      };

      fetchStartingAmount();
    }
  }, [uid]);

  useEffect(() => {
    const fetchTotalAmount = async () => {
      if (!uid) return;

      try {
        const total = await getSavingTotal(uid);
        console.log("Running total:", total);
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching saving total:", error);
      }
    };
    fetchTotalAmount();
  }, [uid]);

  // Save `startingAmount`
  const handleStartingAmountChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newAmount = parseFloat(e.target.value);
    setStartingAmount(newAmount.toString());
    if (uid) {
      try {
        const docRef = doc(db, "users", uid, collectionName, documentId);
        await setDoc(docRef, { startingAmount: newAmount.toString() });
        console.log("Starting amount updated successfully in Firestore!");
      } catch (error) {
        console.error("Error updating starting amount:", error);
      }
    }
  };

  // Fetch `expensesList`
  useEffect(() => {
    const fetchExpensesList = async () => {
      if (uid) {
        try {
          const docRef = doc(db, "users", uid, "expensesList", "data");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as { expenses: TGFormData[] };
            setExpensesList(data.expenses);
          } else {
            console.log("No expenses list found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching expenses list from Firestore:", error);
        }
      }
    };

    fetchExpensesList();
  }, [uid]);

  // Fetch `currentAmount`
  useEffect(() => {
    const fetchCurrentAmount = async () => {
      if (uid) {
        try {
          const docRef = doc(db, "users", uid, "amount", "currentAmountDoc");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as { currentAmount: string };
            setCurrentAmount(parseFloat(data.currentAmount));
          } else {
            console.log("No current amount found in Firestore.");
          }
        } catch (error) {
          console.error("Error fetching current amount from Firestore:", error);
        }
      }
    };

    fetchCurrentAmount();
  }, [uid]);

  const getRandomErrAlert = () => {
    const messages = [
      "Ups, das war leider nicht ganz richtig. Versuch es doch nochmal!",
      "Deine Berechnung stimmt nicht ganz. Denk nochmal nach und probier es erneut!",
      "Fast richtig, aber noch nicht ganz. Gib dir einen Moment und versuch’s nochmal!",
      "Das Ergebnis passt noch nicht. Probier es einfach nochmal in Ruhe!",
      "Huch, da hat sich ein kleiner Fehler eingeschlichen. Versuch es doch nochmal!",
      "Nicht schlimm, das war ein guter Versuch! Versuch es einfach noch einmal!",
      "Deine Berechnung ist leider nicht korrekt. Versuch es nochmal, du kannst das!",
      "Das Ergebnis ist noch nicht richtig. Versuch’s nochmal, ich glaube an dich!",
      "Schade, das war knapp daneben. Versuch es nochmal, du schaffst das!",
      "Deine Antwort ist leider falsch. Aber kein Problem, probier es einfach noch einmal!",
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const getRandomPraise = () => {
    const messages = [
      "Super gemacht, das war genau richtig!",
      "Klasse, du hast die Aufgabe perfekt gelöst!",
      "Richtig gerechnet, das war spitze!",
      "Toll, du hast das wunderbar gelöst!",
      "Fantastisch, deine Antwort ist absolut korrekt!",
      "Bravo, du bist ein Mathe-Champion!",
      "Ausgezeichnet! Deine Berechnung stimmt!",
      "Wow, das war richtig gut! Weiter so!",
      "Du hast das großartig gemacht, alles richtig!",
      "Herzlichen Glückwunsch, das Ergebnis ist perfekt!",
    ];

    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
  };

  const handleCalculate = async () => {
    const expense = parseFloat(dailyExpense);
    const resultNumber = parseFloat(result);

    if (
      isNaN(expense) ||
      expense < 0 ||
      isNaN(resultNumber) ||
      resultNumber < 0
    ) {
      setAlertMessage("Gib bitte eine gültige Zahl ein.");
      setAlertType("error");
      return;
    }

    if (currentAmount - expense !== parseFloat(result)) {
      setAlertMessage(getRandomErrAlert());
      setAlertType("error");
      return;
    }

    setAlertMessage(getRandomPraise());
    setAlertType("success");

    const newExpense = {
      day: selectedDay,
      expense,
      createdOn: Timestamp.now(),
    };
    let updatedList = [];
    if (expensesList.some((item) => item.day === selectedDay)) {
      updatedList = expensesList.map((item) =>
        item.day === selectedDay
          ? {
              day: item.day,
              expense: newExpense.expense + (item.expense ?? 0),
              createdOn: item.createdOn,
            }
          : item
      );
      setExpensesList(updatedList);
      setCurrentAmount((prev) => prev - expense);
      setDailyExpense("0");
      setResult("0");
      setIsResultCorrect(true);
    } else {
      updatedList = [...expensesList, newExpense];

      updatedList.sort(
        (a, b) => weekdays.indexOf(a.day) - weekdays.indexOf(b.day)
      );

      setExpensesList(updatedList);
      setCurrentAmount((prev) => prev - expense);
      setDailyExpense("0");
      setResult("0");
      setIsResultCorrect(true);
    }
    // Save to Firebase
    if (uid) {
      try {
        const docRef = doc(db, "users", uid, "expensesList", "data");
        await setDoc(docRef, { expenses: updatedList });
        console.log("Expenses list updated in Firestore!");
      } catch (error) {
        console.error("Error saving expenses list to Firestore:", error);
      }
      try {
        const docRef = doc(db, "users", uid, "amount", "currentAmountDoc");
        await setDoc(docRef, { currentAmount });
        console.log("Current amount saved to Firestore!");
      } catch (error) {
        console.error("Error saving current amount to Firestore:", error);
      }
    }
  };

  const handleDelete = async (index: number) => {
    const expenseToDelete = expensesList[index].expense;
    const updatedList = expensesList.filter((_, i) => i !== index);

    setExpensesList(updatedList);
    if (expenseToDelete !== null) {
      setCurrentAmount((prev) => prev + expenseToDelete);
    }

    // Update Firebase
    if (uid) {
      try {
        const docRef = doc(db, "users", uid, "expensesList", "data");
        await setDoc(docRef, { expenses: updatedList });
        console.log("Expenses list updated after deletion.");
      } catch (error) {
        console.error("Error updating expenses list in Firestore:", error);
      }
      try {
        const docRef = doc(db, "users", uid, "amount", "currentAmountDoc");
        await setDoc(docRef, { currentAmount });
        console.log("Current amount saved to Firestore!");
      } catch (error) {
        console.error("Error saving current amount to Firestore:", error);
      }
    }
  };

  const showCurrentAmount = () => {
    return isNaN(currentAmount)
      ? "0,00"
      : formatToGerman(parseFloat(currentAmount.toFixed(2)));
  };

  useEffect(() => {
    const calculateCurrentAmount = () => {
      const totalExpenses = expensesList.reduce(
        (acc, item) => acc + (item.expense ?? 0),
        0
      );
      setCurrentAmount(parseFloat(startingAmount) - totalExpenses);
    };

    calculateCurrentAmount();
  }, [startingAmount, expensesList]);

  const handlePigClick = () => {
    setExpensesList([{ day: "", expense: null, createdOn: Timestamp.now() }]);
    setCurrentAmount(0);
    setStartingAmount("0");
    setResult("0");
    addWeeklyLeftIntoSaving(uid, currentAmount);
    toast({
      title: "Das Geld ist im Sparschwein gelandet!",
      description: (
        <span>
          Du hast jetzt{" "}
          <strong style={{ fontSize: "1.1em" }}>
            {formatToGerman(parseFloat(totalAmount.toFixed(2)))}€
          </strong>{" "}
          in deinem Sparkonto!
        </span>
      ),
    });

    // Update Firebase
    if (uid) {
      const updatedList = [
        { day: "", expense: null, createdOn: Timestamp.now() },
      ];
      try {
        const docRef = doc(db, "users", uid, "expensesList", "data");
        setDoc(docRef, { expenses: updatedList });
        console.log("Expenses list updated after pig click.");
      } catch (error) {
        console.error("Error updating expenses list in Firestore:", error);
      }
      try {
        const docRef = doc(
          db,
          "users",
          uid,
          "amount",
          "weeklyStartingAmountDoc"
        );
        setDoc(docRef, { startingAmount: "0" });
        console.log("Starting amount saved to Firestore!");
      } catch (error) {
        console.error("Error saving starting amount to Firestore:", error);
      }
      try {
        const docRef = doc(db, "users", uid, "amount", "currentAmountDoc");
        setDoc(docRef, { currentAmount: 0 });
        console.log("Current amount saved to Firestore!");
      } catch (error) {
        console.error("Error saving current amount to Firestore:", error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {alertMessage && alertType && (
        <Alert
          className="mb-6 py-2"
          variant={alertType === "error" ? "destructive" : "default"}
        >
          <AlertTitle>
            {alertType === "error" ? (
              <img src={monster} className="mx-auto w-10" />
            ) : (
              <img src={balloon} className="mx-auto w-10" />
            )}
          </AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <div className="confetti">
        {isResultCorrect && (
          <Confetti
            recycle={false}
            numberOfPieces={770}
            width={width}
            height={height}
          />
        )}
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <label className="font-medium mb-2 w-1/2 text-left">Einkommen(€)</label>
        <Input
          type="number"
          value={startingAmount}
          onClick={() => setStartingAmount("")}
          onChange={handleStartingAmountChange}
          className="w-1/2 p-2 border border-gray-300 rounded-lg bg-white"
        />
      </div>
      {/* Expense List */}
      <ul className="mb-4">
        {expensesList.map(
          (item, index) =>
            item.expense !== null && (
              <li
                key={index}
                className="w-auto flex justify-between items-center bg-gray-100 px-2 rounded-lg mb-1"
              >
                <div className="flex justify-between items-center w-5/6">
                  <span className="">{item.day} </span>
                  <span className="">
                    -{" "}
                    {formatToGerman(parseFloat((item.expense ?? 0).toFixed(2)))}
                  </span>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-transparent border-none p-1"
                >
                  🗑️
                </button>
              </li>
            )
        )}
      </ul>

      {/* Current Amount */}
      <div className="flex items-center  space-x-4 mb-4">
        <span className="font-medium mb-2 w-1/3 text-left">Kontonstand(€)</span>
        <span className="w-1/3 text-right font-semibold">
          {showCurrentAmount()}
        </span>
        <span className="w-1/3 text-right">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-8 h-8 bg-transparent border-none p-0 hover:animate-shakeUp hover:border-none">
                <img
                  src={coinincrease}
                  className="m-auto p-0"
                  title="Sparschwein"
                />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Willst du das Geld in dein Sparschwein tun?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Deine wöchentliche Ausgabenliste wird gelöscht und der
                  aktuelle Kontostand auf 0 gesetzt.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Nein</AlertDialogCancel>
                <AlertDialogAction onClick={handlePigClick}>
                  Ja
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </span>
      </div>
      {/* Dropdown and Daily Expense */}
      <div className="flex items-center space-x-4 mb-4">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-1 border border-gray-300 rounded-lg bg-white w-1/2"
        >
          {weekdays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <Input
          type="number"
          placeholder="€ Ausgaben"
          onClick={() => setDailyExpense("")}
          value={dailyExpense}
          onChange={(e) => setDailyExpense(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2 bg-white"
        />
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <label className="font-medium mb-2 w-1/2 text-left">Ergebnis(€)</label>
        <Input
          type="number"
          placeholder="Wie viel bleibt?"
          value={result}
          onClick={() => setResult("")}
          onChange={(e) => setResult(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded-lg bg-white"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-4"
      >
        Ergebnis prüfen
      </button>
    </div>
  );
};

export default PocketMoney;
