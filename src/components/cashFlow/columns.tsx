import { ColumnDef } from "@tanstack/react-table";
import { formatToGerman } from "@/utils/format";
import { AccountFlow } from "types";
import { Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<AccountFlow>[] = [
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
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="h-6 w-6 p-0 bg-transparent">
              🗑️
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="p-2">
            <DropdownMenuLabel>
              Möchtest du diesen Betrag löschen?
            </DropdownMenuLabel>
            <div className="flex align-middle justify-end space-x-4">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    payment.createdOn.toDate().toLocaleDateString("de-DE")
                  )
                }
              >
                Ja
              </DropdownMenuItem>
              <DropdownMenuItem>Nein</DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
