import { Listbox } from '@headlessui/react';
import { useState } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

export default function AccessDropdown({ defaultOption, options }) {
  const [selectedRole, setSelectedRole] = useState(defaultOption);

  return (
    <div className="w-full max-w-sm">
      <Listbox value={selectedRole} onChange={setSelectedRole}>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl border border-gray-300 bg-white py-3 pl-4 pr-10 text-left shadow-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm">
            <span className="block truncate text-gray-800 font-medium">{selectedRole}</span>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400 transition-transform duration-200 group-hover:rotate-180" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((role, idx) => (
              <Listbox.Option
                key={idx}
                className={({ active }) =>
                  `relative cursor-pointer select-none px-4 py-2 transition-all duration-150 ease-in-out ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-800'
                  }`
                }
                value={role}
              >
                {({ selected }) => (
                  <div className="flex items-center">
                    {selected && (
                      <CheckIcon className="w-5 h-5 text-blue-500 mr-2" aria-hidden="true" />
                    )}
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {role}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
