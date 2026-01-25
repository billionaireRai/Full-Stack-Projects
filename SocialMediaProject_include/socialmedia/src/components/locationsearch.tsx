'use client';
import React, { useState } from 'react';
import { SearchIcon, MapPinIcon, X, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationSearchProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
  placeholder?: string;
}

interface Location {
  id: string;
  name: string;
  region: string;
  country: string;
}

export default function LocationSearch({ visible, onClose, onSelect, placeholder = "Search locations..." }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample location data
  const sampleLocations: Location[] = [
    { id: '1', name: 'New York', region: 'NY', country: 'United States' },
    { id: '2', name: 'Los Angeles', region: 'CA', country: 'United States' },
    { id: '3', name: 'London', region: 'England', country: 'United Kingdom' },
    { id: '4', name: 'Paris', region: 'Île-de-France', country: 'France' },
    { id: '5', name: 'Tokyo', region: 'Tokyo', country: 'Japan' },
    { id: '6', name: 'Sydney', region: 'NSW', country: 'Australia' },
    { id: '7', name: 'Berlin', region: 'Berlin', country: 'Germany' },
    { id: '8', name: 'Toronto', region: 'ON', country: 'Canada' },
    { id: '9', name: 'Mumbai', region: 'Maharashtra', country: 'India' },
    { id: '10', name: 'São Paulo', region: 'SP', country: 'Brazil' },
  ];

  // Filter locations based on search query (UI only, no actual search logic)
  const filteredLocations = sampleLocations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed p-3 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] max-w-xl mx-auto bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className='flex items-center justify-center gap-10'>
                <LocateFixed/>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search Location</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={15} />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={placeholder}
                  className="w-full pl-10 pr-4 py-3 outline-none border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        onSelect(`${location.name},${location.country}`);
                        onClose();
                      }}
                    >
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{location.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{location.region}, {location.country}</p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No locations found
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
