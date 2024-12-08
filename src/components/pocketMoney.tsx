import { useState, useEffect } from "react";

const PocketMoney = () => {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
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
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    setSelectedDay(today);
  }, []);

  const handleCalculate = () => {
    const expense = parseFloat(dailyExpense);

    if (
      isNaN(expense) ||
      expense < 0 ||
      isNaN(parseFloat(result)) ||
      parseFloat(result) < 0
    ) {
      alert("Please enter a valid amount.");
      return;
    }

    if (currentAmount - expense !== parseFloat(result)) {
      alert("Ops, the result is wrong, try again!");
      return;
    }

    const newExpense = { day: selectedDay, expense };
    const updatedList = [...expensesList, newExpense];

    updatedList.sort(
      (a, b) => weekdays.indexOf(a.day) - weekdays.indexOf(b.day)
    );

    setExpensesList(updatedList);
    setCurrentAmount((prev) => prev - expense);
    setDailyExpense("0");
  };

  const handleDelete = (index: number) => {
    const expenseToDelete = expensesList[index].expense;

    const updatedList = expensesList.filter((_, i) => i !== index);
    setExpensesList(updatedList);
    setCurrentAmount((prev) => prev + expenseToDelete);
  };

  const showCurrentAmount = () => {
    return isNaN(currentAmount) ? "0.00" : currentAmount.toFixed(2);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-4 mb-4">
        <label className="font-medium mb-2 w-1/2 text-left">
          Weekly Income (€):
        </label>
        <input
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
            className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg mb-2"
          >
            <span>
              {item.day}: €{item.expense.toFixed(2)}
            </span>
            <button
              onClick={() => handleDelete(index)}
              className="bg-transparent border-none"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {/* Current Amount */}
      <div className="flex items-center space-x-4 mb-4">
        <span className="font-medium mb-2 w-1/2 text-left">
          Current Amount (€):
        </span>
        <span className="w-1/2 text-left">{showCurrentAmount()}</span>
      </div>
      {/* Dropdown and Daily Expense */}
      <div className="flex items-center space-x-4 mb-4">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg bg-white w-1/2"
        >
          {weekdays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="€ Expense"
          value={dailyExpense}
          onChange={(e) => setDailyExpense(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-1/2 bg-white"
        />
      </div>
      <div className="flex items-center space-x-4 mb-4">
        <label className="font-medium mb-2 w-1/2 text-left">Result (€):</label>
        <input
          type="number"
          value={result}
          onChange={(e) => setResult(e.target.value)}
          className="w-1/2 p-2 border border-gray-300 rounded-lg bg-white"
        />
      </div>

      <button
        onClick={handleCalculate}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mb-4"
      >
        Check Result
      </button>
    </div>
  );
};

export default PocketMoney;
