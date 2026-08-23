export type SavingAction = "deposit" | "withdraw";

type SavingEntry = {
  amount: number;
  isPlus: boolean;
};

type Expense = {
  expense: number | null;
};

export type PocketMoneyCalculation =
  | { status: "correct"; expense: number; result: number }
  | { status: "incorrect"; expense: number; result: number }
  | { status: "invalid" };

export const parseMoneyInput = (value: string | number): number =>
  typeof value === "number"
    ? value
    : Number.parseFloat(value.replace(",", "."));

export const calculateSavingTotal = (
  currentTotal: number,
  amount: number,
  action: SavingAction,
): number =>
  action === "deposit" ? currentTotal + amount : currentTotal - amount;

export const calculateTotalAfterDeletingSaving = (
  currentTotal: number,
  deletedEntry: SavingEntry,
): number =>
  calculateSavingTotal(
    currentTotal,
    deletedEntry.amount,
    deletedEntry.isPlus ? "withdraw" : "deposit",
  );

export const sumExpenses = (expenses: Expense[]): number =>
  expenses.reduce((total, item) => total + (item.expense ?? 0), 0);

export const calculateRemainingAmount = (
  startingAmount: string | number,
  expenses: Expense[],
): number => parseMoneyInput(startingAmount) - sumExpenses(expenses);

export const validatePocketMoneyCalculation = (
  currentAmount: number,
  expenseInput: string | number,
  resultInput: string | number,
  tolerance = 0.01,
): PocketMoneyCalculation => {
  const expense = parseMoneyInput(expenseInput);
  const result = parseMoneyInput(resultInput);

  if (
    !Number.isFinite(currentAmount) ||
    currentAmount < 0 ||
    !Number.isFinite(expense) ||
    expense < 0 ||
    !Number.isFinite(result) ||
    result < 0
  ) {
    return { status: "invalid" };
  }

  return Math.abs(currentAmount - expense - result) <= tolerance
    ? { status: "correct", expense, result }
    : { status: "incorrect", expense, result };
};
