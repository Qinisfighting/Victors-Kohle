import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Currency, currencySymbols, useCurrency } from "@/context/CurrencyContext";

const currencyOptions: Currency[] = ["EUR", "USD", "GBP", "CHF", "CNY"];

const CurrencyToggle = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select
      value={currency}
      onValueChange={(value) => setCurrency(value as Currency)}
    >
      <SelectTrigger className="h-7 w-16 px-2 text-xs bg-white shadow-sm">
        <SelectValue>{currencySymbols[currency]}</SelectValue>
      </SelectTrigger>
      <SelectContent align="end" className="min-w-20">
        {currencyOptions.map((option) => (
          <SelectItem key={option} value={option} className="py-1 pl-2 pr-6 text-xs">
            {currencySymbols[option]} {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencyToggle;
