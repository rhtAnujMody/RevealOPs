import React from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DropdownItem {
  label: string;
  value: string;
}

interface CommonDropdownProps {
  items: DropdownItem[];
  onSelect: (value: string) => void;
  selectedValue: string;
  placeholder?: string;
  className?: string;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({
  items,
  onSelect,
  selectedValue,
  placeholder = "Select an option",
  className = '',
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
        >
          {selectedValue
            ? items.find((item) => item.value === selectedValue)?.label
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={`w-full p-0 ${className}`}>
        <div className="max-h-[300px] overflow-y-auto rounded-md bg-white shadow-md">
          {items?.map((item) => (
            <div
              key={item.value}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                item.value === selectedValue ? 'bg-blue-50 text-blue-600' : ''
              }`}
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >
              <span>{item.label}</span>
              {item.value === selectedValue && (
                <Check className="h-4 w-4 text-blue-600" />
              )}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CommonDropdown;
