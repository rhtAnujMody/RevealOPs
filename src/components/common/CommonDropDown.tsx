import React from 'react';
import { ChevronDown } from 'lucide-react';
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
      <PopoverContent className={`w-[200px] p-0 ${className}`}>
        <div className="max-h-[200px] overflow-y-auto">
          {items?.map((item) => (
            <div
              key={item.value}
              className="flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onSelect(item.value);
                setOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CommonDropdown;
