'use client';
import { useState , useEffect } from 'react';
import { SearchIcon, MapPinIcon, X, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '@/lib/interceptor';

interface LocationSearchProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: {text: string, coordinates: number[]}) => void;
  placeholder?: string;
}

interface Location {
  id: string;
  text: string;
  region: string;
  country: string;
  coordinates: number[];
}

export default function LocationSearch({ visible, onClose, onSelect, placeholder = "Search locations..." }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState(''); // state handling search query..

  // Sample location data
  const sampleLocations = [
    { id: '1', text: 'New York', region: 'NY', country: 'United States', coordinates: [40.7128, -74.0060] }, // lat,long
    { id: '2', text: 'Los Angeles', region: 'CA', country: 'United States', coordinates: [34.0522, -118.2437] },
    { id: '3', text: 'London', region: 'England', country: 'United Kingdom', coordinates: [51.5074, -0.1278] },
    { id: '4', text: 'Paris', region: 'Île-de-France', country: 'France', coordinates: [48.8566, 2.3522] },
    { id: '5', text: 'Tokyo', region: 'Tokyo', country: 'Japan', coordinates: [35.6762, 139.6503] },
    { id: '6', text: 'Sydney', region: 'NSW', country: 'Australia', coordinates: [-33.8688, 151.2093] },
    { id: '7', text: 'Berlin', region: 'Berlin', country: 'Germany', coordinates: [52.5200, 13.4050] },
    { id: '8', text: 'Toronto', region: 'ON', country: 'Canada', coordinates: [43.6532, -79.3832] },
    { id: '9', text: 'Mumbai', region: 'Maharashtra', country: 'India', coordinates: [19.0760, 72.8777] },
    { id: '10', text: 'São Paulo', region: 'SP', country: 'Brazil', coordinates: [-23.5505, -46.6333] },
  ];
  const [SearchedLocation, setSearchedLocation] = useState<Location[]>(sampleLocations) ;

  // Filter locations based on search query (UI only, no actual search logic)
  useEffect(() => {
    if(!searchQuery.trim()){
      setSearchedLocation(sampleLocations); // resetting to original followings...
      return; 
    }
    async function getTheSearchedLocation(searchtext:string) {
      try {
        const searchapi = await axiosInstance.get(`/api/location?search=${searchtext}`);
         if (searchapi.status === 200) {
           setSearchedLocation(searchapi.data.searchedLocation) ; // updating the searched locations state..
        }
       } catch (error) {
         console.log('An Error occured :',error);
       }
    }
    
    const delayDebounce = setTimeout(() => {
      getTheSearchedLocation(searchQuery) ;
    }, 300 );
    
    // cleanup previous timer on second update...
    return () => {
      clearTimeout(delayDebounce);
    }
  }, [searchQuery])
  

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
                <LocateFixed size={25}/>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search Location</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
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
                  className="w-full pl-10 pr-4 py-3 outline-none border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:border-yellow-500 dark:focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              <AnimatePresence>
                {SearchedLocation.length > 0 ? (
                  SearchedLocation.map((location, index) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center rounded-lg gap-3 p-4 hover:bg-yellow-50 dark:hover:bg-gray-950 cursor-pointer transition-colors duration-150"
                      onClick={() => {
                        onSelect({text: location.text, coordinates: location.coordinates});
                        onClose();
                      }}
                    >
                      <MapPinIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{location.text}</p>
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
