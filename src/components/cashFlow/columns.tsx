import { ColumnDef } from "@tanstack/react-table";
import { formatToGerman } from "@/utils/format";
import { AccountFlow } from "types";
import { Timestamp } from "firebase/firestore";

export const columns: ColumnDef<AccountFlow>[] = [
  {
    accessorKey: "reason",
    header: "Zweck",
    cell: (cell) => {
      const value = cell.getValue();
      return typeof value === "string" && value.trim() !== ""
        ? value
        : "Kein Zweck";
    },
  },
  {
    accessorKey: "amount",
    header: "Betrag(€)",
    cell: (cell) => {
      const value = cell.getValue();
      const amount = typeof value === "number" && !isNaN(value) ? value : null;
      return amount !== null ? formatToGerman(amount) : "Kein Wert"; // "Invalid Amount"
    },
  },
  {
    accessorKey: "createdOn",
    header: "Erstellt am",
    cell: (cell) => {
      const value = cell.getValue();
      if (value instanceof Timestamp) {
        return value.toDate().toLocaleDateString("de-DE");
      }
      if (value instanceof Date) {
        return value.toLocaleDateString("de-DE");
      }
      if (typeof value === "string") {
        const parsedDate = new Date(value);
        return !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString("de-DE")
          : "Ungültiges Datum";
      }
      return "Kein Datum";
    },
  },
];
