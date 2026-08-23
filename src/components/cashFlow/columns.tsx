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
import { formatAmount } from "@/utils/format";
import { Language, localeMap, reasonLabels, TranslationKey } from "@/i18n/translations";

export const getColumns = (
  uid: string | null,
  onDelete: (deletedItem: AccountFlow) => void, // Accept delete callback
  language: Language,
  t: (key: TranslationKey) => string,
  currencySymbol: string
): ColumnDef<AccountFlow>[] => [
  {
    accessorKey: "createdOn",
    header: t("dateHeader"),
    cell: (cell) => {
      const value = cell.getValue();
      const locale = localeMap[language];
      if (value instanceof Timestamp) {
        return value.toDate().toLocaleDateString(locale);
      }
      if (value instanceof Date) {
        return value.toLocaleDateString(locale);
      }
      if (typeof value === "string") {
        const parsedDate = new Date(value);
        return !isNaN(parsedDate.getTime())
          ? parsedDate.toLocaleDateString(locale)
          : t("invalidDateText");
      }
      return t("noDateText");
    },
  },
  {
    accessorKey: "reason",
    header: t("reasonHeader"),
    cell: (cell) => {
      const value = cell.getValue();
      if (typeof value !== "string" || value.trim() === "") {
        return t("noReasonText");
      }
      return reasonLabels[language][value] ?? value;
    },
  },
  {
    accessorKey: "amount",
    header: `${t("amountHeader")} (${currencySymbol})`,
    cell: ({ row }) => {
      const { amount, isPlus } = row.original;

      // Determine the sign and color based on isPlus
      const sign = isPlus ? "+" : "-";
      const textColor = isPlus ? "text-emerald-500" : "text-red-500";

      return (
        <span className={clsx("font-bold", textColor)}>
          {sign}
          {formatAmount(amount, language)}
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
              {t("deleteAmountQuestion")}
            </DropdownMenuLabel>
            <div className="flex align-middle justify-end space-x-4">
              <DropdownMenuItem onClick={handleDelete}>{t("yesButton")}</DropdownMenuItem>
              <DropdownMenuItem>{t("noButton")}</DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
