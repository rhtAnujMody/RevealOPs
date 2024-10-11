import React, { useEffect, useRef, useState } from 'react';

interface DropdownItem {
  label: string;
  value: string;
}

interface CommonDropdownProps {
  items: DropdownItem[];
  onSelect: (value: string) => void;
  placeholder?: string;
  selectedValue?: string | null;
}

const CommonDropdown: React.FC<CommonDropdownProps> = ({ items, onSelect, placeholder, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="border p-2 w-full text-left">
        {selectedValue ? items.find(item => item.value === selectedValue)?.label : placeholder || 'Select an option'}
      </button>
      {isOpen && (
        <ul className="absolute border bg-white w-full mt-1 z-10">
          {items.map(item => (
            <li key={item.value} onClick={() => handleSelect(item)} className="p-2 hover:bg-gray-200 cursor-pointer ">
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommonDropdown;
