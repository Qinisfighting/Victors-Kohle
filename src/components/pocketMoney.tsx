import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

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

  const [selectedDay, setSelectedDay] = useState("");
  const [dailyExpense, setDailyExpense] = useState<string>("0");
  const [result, setResult] = useState<string>("0");
  const [startingAmount, setStartingAmount] = useState(15);
  const [currentAmount, setCurrentAmount] = useState(15);
  const [expensesList, setExpensesList] = useState<
    { day: string; expense: number }[]
  >([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString("de-DE", { weekday: "long" });
    setSelectedDay(today);
  }, []);

  const handleCalculate = () => {
    const expense = parseFloat(dailyExpense);
    const resultNumber = parseFloat(result);

    if (
      isNaN(expense) ||
      expense < 0 ||
      isNaN(resultNumber) ||
      resultNumber < 0
    ) {
      alert("Gib bitte eine gültige Zahl ein.");
      return;
    }

    if (currentAmount - expense !== parseFloat(result)) {
      alert("Ups, die Berechnung ist falsch, versuch es nochmal!");
      return;
    }

    const newExpense = { day: selectedDay, expense };

    if (expensesList.some((item) => item.day === selectedDay)) {
      const updatedList = expensesList.map((item) =>
        item.day === selectedDay
          ? { day: item.day, expense: newExpense.expense + item.expense }
          : item
      );
      setExpensesList(updatedList);
      setCurrentAmount((prev) => prev - expense);
      setDailyExpense("0");
      setResult("0");
    } else {
      const updatedList = [...expensesList, newExpense];

      updatedList.sort(
        (a, b) => weekdays.indexOf(a.day) - weekdays.indexOf(b.day)
      );

      setExpensesList(updatedList);
      setCurrentAmount((prev) => prev - expense);
      setDailyExpense("0");
      setResult("0");
    }
  };

  const handleDelete = (index: number) => {
    const expenseToDelete = expensesList[index].expense;

    const updatedList = expensesList.filter((_, i) => i !== index);
    setExpensesList(updatedList);
    setCurrentAmount((prev) => prev + expenseToDelete);
  };

  const formatToGerman = (value: number | bigint) => {
    return new Intl.NumberFormat("de-DE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const showCurrentAmount = () => {
    return isNaN(currentAmount)
      ? "0,00"
      : formatToGerman(parseFloat(currentAmount.toFixed(2)));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-4 mb-4">
        <label className="font-medium mb-2 w-1/2 text-left">
          Einkommen (€):
        </label>
        <Input
          type="number"
          value={startingAmount}
          onChange={(e) => {
            const newAmount = parseFloat(e.target.value);
            setStartingAmount(newAmount);
            setCurrentAmount(
              newAmount -
                expensesList.reduce((acc, item) => acc + item.expense, 0)
            );
          }}
          className="w-1/2 p-2 border border-gray-300 rounded-lg bg-white"
        />
      </div>
      {/* Expense List */}
      <ul className="mb-4">
        {expensesList.map((item, index) => (
          <li
            key={index}
            className="w-auto flex justify-between items-center bg-gray-100 px-2 rounded-lg mb-1"
          >
            <div className="flex justify-between items-center w-5/6">
              <span className="">{item.day}(€): </span>
              <span className="">
                - {formatToGerman(parseFloat(item.expense.toFixed(2)))}
              </span>
            </div>
            <button
              onClick={() => handleDelete(index)}
              className="bg-transparent border-none p-1"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {/* Current Amount */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="font-medium mb-2 w-1/2 text-left">
          Kontonstand (€):
        </span>
        <span className="w-1/2 text-left">{showCurrentAmount()}</span>
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
        <label className="font-medium mb-2 w-1/2 text-left">
          Ergebnis (€):
        </label>
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
