'use client'

import React, { useEffect, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

// defining some of the interfaces...
interface Option {
  value: string;
  label: string;
  priority: string;
}

interface CustomDropdownProps {
  selectedValue: Option;
  onChange: (obj: Option) => void;
  options: Option[];
}

export default function CustomDropdown({ selectedValue, onChange, options }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const selectedOption = options.find(option => option.value === selectedValue.value);
  
  const handleSelect = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  };
   // Close more options when clicking outside...
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isOpen && !(event.target as Element).closest('.dropdown-container')) {
          setIsOpen(false)
        }
      }
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside)
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [isOpen])

  return (
    <div className="relative dropdown-container">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded-md shadow-sm dark:shadow-gray-800 hover:shadow-md transition-shadow duration-200 text-gray-900 dark:text-gray-100 font-medium"
      >
        <span>{selectedOption?.label || 'Select option'}</span>
        <FiChevronDown className={`ml-2 transition-transform cursor-pointer duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full p-1 bg-white dark:bg-black rounded-md dark:shadow-gray-900 shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors duration-150 ${
                selectedValue.value === option.value ? 'dark:bg-blue-900 bg-yellow-300 text-yellow-600 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
