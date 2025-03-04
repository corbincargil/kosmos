import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ICON_MAP } from "@/app/(authenticated)/_components/layout/sidebar/constants";

interface IconSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export default function IconSelect({
  value,
  onValueChange,
  disabled = false,
}: IconSelectProps) {
  const SelectedIcon = ICON_MAP[value];

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[120px]">
        <div className="flex items-center gap-2 w-full">
          <div className="flex-shrink-0">
            {SelectedIcon && <SelectedIcon size={16} />}
          </div>
          <span className="px-1 truncate flex-1 text-sm">{value}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(ICON_MAP).map(([name, Icon]) => (
          <SelectItem key={name} value={name}>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-shrink-0">
                <Icon size={16} />
              </div>
              <span className="truncate flex-1 text-sm">{name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
