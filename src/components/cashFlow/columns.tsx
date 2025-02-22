import { Timestamp } from "firebase/firestore";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteLogItem } from "../../firebase";
import { AccountFlow } from "types";
import clsx from "clsx";
import { formatToGerman } from "@/utils/format";

export const getColumns = (
  uid: string | null,
  onDelete: (deletedItem: AccountFlow) => void // Accept delete callback
): ColumnDef<AccountFlow>[] => [
  {
    accessorKey: "createdOn",
    header: "Datum",
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
    cell: ({ row }) => {
      const { amount, isPlus } = row.original;

      // Determine the sign and color based on isPlus
      const sign = isPlus ? "+" : "-";
      const textColor = isPlus ? "text-emerald-500" : "text-red-500";

      return (
        <span className={clsx("font-bold", textColor)}>
          {sign}
          {formatToGerman(amount)}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const logItem = row.original;

      const handleDelete = async (event: React.MouseEvent) => {
        event.preventDefault();
        if (!uid) {
          console.error("User is not authenticated.");
          return;
        }
        try {
          await deleteLogItem(uid, logItem.createdOn as Timestamp);
          onDelete(logItem); // Call the parent function to update the table
        } catch (error) {
          console.error("Error deleting item:", error);
        }
      };

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
              <DropdownMenuItem onClick={handleDelete}>Ja</DropdownMenuItem>
              <DropdownMenuItem>Nein</DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
