import { describe, expect, it } from "vitest";
import {
  calculateRemainingAmount,
  calculateSavingTotal,
  calculateTotalAfterDeletingSaving,
  parseMoneyInput,
  sumExpenses,
  validatePocketMoneyCalculation,
} from "./calculations";

describe("savings calculations", () => {
  it("adds a deposit to the current total", () => {
    expect(calculateSavingTotal(20, 7.5, "deposit")).toBe(27.5);
  });

  it("subtracts a withdrawal from the current total", () => {
    expect(calculateSavingTotal(20, 7.5, "withdraw")).toBe(12.5);
  });

  it("reverses a deposit when its log entry is deleted", () => {
    expect(
      calculateTotalAfterDeletingSaving(27.5, {
        amount: 7.5,
        isPlus: true,
      }),
    ).toBe(20);
  });

  it("reverses a withdrawal when its log entry is deleted", () => {
    expect(
      calculateTotalAfterDeletingSaving(12.5, {
        amount: 7.5,
        isPlus: false,
      }),
    ).toBe(20);
  });
});

describe("pocket money calculations", () => {
  it("parses German and English decimal separators", () => {
    expect(parseMoneyInput("12,50")).toBe(12.5);
    expect(parseMoneyInput("12.50")).toBe(12.5);
  });

  it("sums expenses and ignores empty entries", () => {
    expect(
      sumExpenses([{ expense: 2.5 }, { expense: null }, { expense: 3 }]),
    ).toBe(5.5);
  });

  it("calculates the balance from the starting amount and expenses", () => {
    expect(
      calculateRemainingAmount("20,00", [
        { expense: 2.5 },
        { expense: 3.25 },
      ]),
    ).toBe(14.25);
  });

  it("accepts a correct answer with comma decimals", () => {
    expect(validatePocketMoneyCalculation(10, "2,50", "7,50")).toEqual({
      status: "correct",
      expense: 2.5,
      result: 7.5,
    });
  });

  it("allows small floating-point differences within one cent", () => {
    expect(validatePocketMoneyCalculation(0.3, 0.1, 0.2).status).toBe(
      "correct",
    );
    expect(validatePocketMoneyCalculation(10, 2, 7.995).status).toBe(
      "correct",
    );
  });

  it("rejects an incorrect answer outside the tolerance", () => {
    expect(validatePocketMoneyCalculation(10, 2, 7.98).status).toBe(
      "incorrect",
    );
  });

  it.each([
    [Number.NaN, "2", "8"],
    [10, "not a number", "8"],
    [10, "-2", "12"],
    [10, "2", "-8"],
  ])(
    "rejects invalid values (current: %s, expense: %s, result: %s)",
    (current, expense, result) => {
      expect(
        validatePocketMoneyCalculation(current, expense, result),
      ).toEqual({ status: "invalid" });
    },
  );
});
