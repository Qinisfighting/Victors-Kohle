import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";
import { Language } from "@/i18n/translations";

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as Language)}
    >
      <SelectTrigger className="h-7 w-16 px-2 text-xs bg-white shadow-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-16">
        <SelectItem value="de" className="py-1 pl-2 pr-6 text-xs">
          DE
        </SelectItem>
        <SelectItem value="en" className="py-1 pl-2 pr-6 text-xs">
          EN
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageToggle;
