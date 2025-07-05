"use client";

import { useState , useEffect} from 'react';
import CustomSelect from '@/components/customSelect';
import useUserID from '@/state/useridState';
import VaultNavbar from '@/components/navbar.jsx';
import useIsUserAuthenticated from '@/state/userAuthenticated';
import toast from 'react-hot-toast';
import { getUserLocationInfoByPermission } from '@/lib/userLocation';
import useUserPassPhraseHash from '@/state/passphraseHash';
import Image from 'next/image';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';
import { useInactivityChecker } from '@/components/useInactivityChecker.jsx';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function MainDashboardPage() {
  const { userId } = useUserID() ;
  const { PassPhraseHashValue } = useUserPassPhraseHash() ;
  const { isAuthenticated } = useIsUserAuthenticated() ; // intializing the hook of user authentication state...
    useInactivityChecker(process.env.NEXT_PUBLIC_INACTIVITY_CHECKER_LOGOUT) ; // component for integrating inactivity checker functionality...
    // these are all default values...
    const [buttonClickedProccesing, setbuttonClickedProccesing] = useState(false) ;
    const [UserIP, setUserIP] = useState(null);
    const [topInformation, settopInformation] = useState([
    { label: 'Total Vaults', value: '14' },
    { label: 'Items Stored', value: '274' },
    { label: 'Shared Vaults', value: '3' },
    { label: 'Breach Alerts', value: '1 Active', valueClass: 'text-red-600 dark:text-red-400' },
]);

const [vaultUsageData, setvaultUsageData] = useState([
    { name: 'Jan', count: 4 },
    { name: 'Feb', count: 6 },
    { name: 'Mar', count: 10 },
    { name: 'Apr', count: 12 },
    { name: 'May', count: 15 },
    { name: 'Jun', count: 10 },
    { name: 'Jul', count: 3 },
    { name: 'Aug', count: 11 },
    { name: 'Sep', count: 20 },
    { name: 'Oct', count: 0 },
    { name: 'Nov', count: 0 },
    { name: 'DEc', count: 5 },
]);

const [vaultTypeData, setvaultTypeData] = useState([
  { name: 'Private', value: 10 },
  { name: 'Shared', value: 4 },
]);

const [breachTrendData, setbreachTrendData] = useState([
  { name: 'Mon 1', breaches: 1 },
  { name: 'Mon 2', breaches: 2 },
  { name: 'Mon 3', breaches: 2 },
  { name: 'Mon 4', breaches: 4 },
  { name: 'Mon 5', breaches: 5 },
  { name: 'Mon 6', breaches: 2 },
  { name: 'Mon 7', breaches: 9 },
  { name: 'Mon 8', breaches: 7 },
  { name: 'Mon 9', breaches: 1 },
  { name: 'Mon 10', breaches: 1 },
  { name: 'Mon 11', breaches: 10 },
  { name: 'Mon 12', breaches: 13 },
]);

const [categoryData, setcategoryData] = useState([
  { name: 'password-details', value: 120 },
  { name: 'bank-account', value: 45 },
  { name: 'cryptowallet-details', value: 60 },
  { name: 'credit-card', value: 49 },
  { name: 'other' , value:10}
]);

const [storageData, setstorageData] = useState([
  { name: 'Used', value: 70, fill: '#8884d8' },
  { name: 'Available', value: 30, fill: '#d0d0d0' },
])

const [RecentActivity, setRecentActivity] = useState([
  { action:"Added new item to Bank Vault" , when:"2h",place:'delhi',ip:'124.403.21' },
  { action:"Shared vault access granted to John" , when:"1d",place:'mumbai',ip:'124.423.41' },
  { action:"Vault settings Changed" , when:"2d",place: 'chennai',ip:'124.213.21'},
]);

const [sortOptions, setsortOptions] = useState([
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'ip', label: 'By IP Address' },
  { value: 'location', label: 'By Location' },
  { value: 'action', label: 'By Action' },
]);

// recent activity log animations...
const listContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};


// function handling request ot route for breach...
const functionToUpdateBreachInDB = async () => { 
  try {
    const apiRes = await axios.put('/apis/user/dashboard') ;
    console.log(apiRes.data.message);
    return apiRes.data.message ;
  } catch (error) {
    console.error(error);
    return "DB Breach Update failed...";
  }
 }
// function to get dashboard related data...
const fetchData = async () =>{
  try {
    const incomingData = await axios.post('/apis/user/dashboard',{method:'POST'})
    settopInformation(incomingData.data.topInformation) // data in response should be of this name exact...
    setvaultUsageData(incomingData.data.vaultUsageData)
    setvaultTypeData(incomingData.data.vaultTypeData)
    setbreachTrendData(incomingData.data.breachTrendData)
    setcategoryData(incomingData.data.categoryData)
    setstorageData(incomingData.data.storageData)
  } catch (error) {
    console.error(error);
  }
  }
useEffect(() => {
   // functionToUpdateBreachInDB() ; // will uncomment it when will get HIBP api-key...
   fetchData() ; // uncomment it immedeatly for this page...

}, [])


// function for handling security check click...
const handleRecentActivityUpdationLogic = async () => {
  try {
    setbuttonClickedProccesing(true) ; // setting it true...
    const activityUpRes = await axios.get("/apis/user/dashboard") ;
    console.log(activityUpRes.data.message);
    setRecentActivity(activityUpRes.data.recentActivity) ;
    setbuttonClickedProccesing(false) ;
    return activityUpRes.data.message ;
  } catch (error) {
    console.error(error);
    setbuttonClickedProccesing(false) ;
    return "Security Check failed...";
  }
 }

 // adding toast promise on the above funtion...
const handleRecentToast = async () => {
  return toast.promise(handleRecentActivityUpdationLogic(), {
    loading: "Verifying recent activity and securing access...",
    success: () => "Vault integrity and user credentials verified successfully.",
    error: "Security validation failed. Please try again.",
  }, {
    success: { duration: 3000 },
    error: { duration: 3000 },
    loading: { duration:2000 },
  });
};

// function for handling the vault report generation logic...
const handleGenerateVaultReportLogic = async () => { 
  try {
    setbuttonClickedProccesing(true) ;
    const reportGeneratedFrom = await getUserLocationInfoByPermission() // getting the current location of user...
    const response = await axios.patch('/apis/user/dashboard', { isAuthenticated: true, reportGeneratedFrom:reportGeneratedFrom }, { responseType: 'blob' }); // making the request to backend endpoint...
    // create a blob link to download the PDF...
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'vault-report.pdf');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    setbuttonClickedProccesing(false) ;
  } catch (error) {
    console.error('Error generating vault report:', error);
    setbuttonClickedProccesing(false) ;
  }
}

// useffect for sorting the activity logs...
const [selectedOption, setselectedOption] = useState(sortOptions[0]) ; // setting default selected option...
useEffect(() => {
  let sortedActivities = [];
  if (selectedOption.value === 'latest') {
    // Sort by latest first based on 'when' date descending
    sortedActivities = [...RecentActivity].sort((a, b) => new Date(b.when) - new Date(a.when));
  } else if (selectedOption.value === 'oldest') {
    // Sort by oldest first based on 'when' date ascending
    sortedActivities = [...RecentActivity].sort((a, b) => new Date(a.when) - new Date(b.when));
  } else if (selectedOption.value === 'ip') {
    // Sort by IP address lexicographically
    sortedActivities = [...RecentActivity].sort((a, b) => a.ip.localeCompare(b.ip));
  } else if (selectedOption.value === 'location') {
    // Sort by location lexicographically
    sortedActivities = [...RecentActivity].sort((a, b) => a.place.localeCompare(b.place));
  } else {
    // Sort by action lexicographically
    sortedActivities = [...RecentActivity].sort((a, b) => a.action.localeCompare(b.action));
  }
  // Only update state if sortedActivities is different from RecentActivity to avoid infinite loop
  const isEqual = sortedActivities.length === RecentActivity.length && sortedActivities.every((val, index) => {
    const recentVal = RecentActivity[index];
    return val.action === recentVal.action && val.when === recentVal.when && val.place === recentVal.place && val.ip === recentVal.ip;
  });
  if (!isEqual) setRecentActivity(sortedActivities);
  
}, [selectedOption, RecentActivity])


return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-800 dark:text-gray-100">
      <nav>
        <VaultNavbar />
      </nav>
      <main className="pt-24 px-6 md:px-12 max-w-7xl mx-auto">
        <h1 className="text-4xl flex items-center gap-3 font-extrabold mb-10 text-left text-gray-900 dark:text-gray-100">
          <span>Your Vault Dashboard</span>
          <Image width={50} height={50} src="/images/secreticon.png" alt="logo" />
        </h1>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {topInformation?.map((stat, i) => (
            <div key={i} className={`${stat.label === 'Breach Alerts' ? 'animate-pulse border-red-500 dark:border-red-400 shadow-red-400 dark:shadow-red-600' : ""} cursor-pointer bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition`}>
              <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</h2>
              <p className={`text-3xl font-bold mt-2 ${stat.valueClass || 'text-gray-900 dark:text-gray-100'}`}>{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          <VisualCardForStats title="Vault Usage Over Time">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart style={{cursor:"pointer"}} data={vaultUsageData}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // subtle hover effect
                  contentStyle={{ backgroundColor: '#111827',  border: '1px solid #374151',  borderRadius: '0.5rem', padding: '0.75rem 1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', color: '#F9FAFB',  fontSize: '0.875rem', fontWeight: 500, minWidth:'20px'}}
                  labelStyle={{ color: '#D1D5DB', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem',}}
                  itemStyle={{ color: '#F9FAFB', padding: '2px 0px',}}
                  wrapperStyle={{ zIndex: 50,}}
                   />
              </LineChart>
            </ResponsiveContainer>
          </VisualCardForStats>

          <VisualCardForStats title="Vault Type Distribution">
            <ResponsiveContainer width="100%" height={250}>
              {vaultTypeData && vaultTypeData.length > 0 ? (
                <PieChart style={{cursor:"pointer"}}>
                  <Pie data={vaultTypeData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {vaultTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#60A5FA' : '#FBBF24'} />
                    ))}
                  </Pie>
                  <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // subtle hover effect
                  contentStyle={{ backgroundColor: '#111827',  border: '1px solid #374151',  borderRadius: '0.5rem', padding: '0.75rem 1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', color: '#F9FAFB',  fontSize: '0.875rem', fontWeight: 500 }}
                  labelStyle={{ color: '#D1D5DB',  fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}
                  itemStyle={{ color: '#F9FAFB', padding: '2px 0' }}
                  wrapperStyle={{ zIndex: 50 }}
                   />
                </PieChart>
              ) : (
                <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
                  No data available
                </div>
              )}
            </ResponsiveContainer>
          </VisualCardForStats>

          <VisualCardForStats title="Breach Alerts Trend">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart style={{cursor:"pointer"}} data={breachTrendData}>
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Bar dataKey="breaches" fill="#EF4444" />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // subtle hover effect
                  contentStyle={{ backgroundColor: '#111827',  border: '1px solid #374151',  borderRadius: '0.5rem', padding: '0.75rem 1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', color: '#F9FAFB',  fontSize: '0.875rem', fontWeight: 500 }}
                  labelStyle={{ color: '#D1D5DB',  fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}
                  itemStyle={{ color: '#F9FAFB', padding: '2px 0' }}
                  wrapperStyle={{ zIndex: 50 }}
                   />
              </BarChart>
            </ResponsiveContainer>
          </VisualCardForStats>

          <VisualCardForStats title="Item Categories">
            <ResponsiveContainer width="100%" height={250}>
                <BarChart style={{cursor:"pointer"}} data={categoryData} layout="vertical">
                  <XAxis type="number" stroke="#6B7280" />
                  <YAxis dataKey="name" type="category" stroke="#6B7280" />
                  <Bar dataKey="value" fill="#34D399" />
                  <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // subtle hover effect
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151',  borderRadius: '0.5rem', padding: '0.75rem 1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', color: '#F9FAFB',  fontSize: '0.875rem', fontWeight: 500 }}
                  labelStyle={{ color: '#D1D5DB', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}
                  itemStyle={{ color: '#F9FAFB', padding: '2px 0' }}
                  wrapperStyle={{ zIndex: 50 }}
                   />
                </BarChart>
            </ResponsiveContainer>
          </VisualCardForStats>

          <VisualCardForStats title="Storage Consumption">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart style={{cursor:"pointer"}} innerRadius="60%" outerRadius="100%" data={storageData} startAngle={90} endAngle={-270}>
                <RadialBar background clockWise dataKey="value" />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // subtle hover effect
                  contentStyle={{ backgroundColor: '#111827',  border: '1px solid #374151',  borderRadius: '0.5rem', padding: '0.75rem 1rem', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)', color: '#F9FAFB',  fontSize: '0.875rem', fontWeight: 500 }}
                  labelStyle={{ color: '#D1D5DB',  fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}
                  itemStyle={{ color: '#F9FAFB', padding: '2px 0' }}
                  wrapperStyle={{ zIndex: 50 }}
                   />
              </RadialBarChart>
            </ResponsiveContainer>
          </VisualCardForStats>
        </section>

        {/* Quick Actions */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            {userId && (
              <Link 
                href={`/user/${userId}/shared-vault/${PassPhraseHashValue}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-md font-medium transition">
                Manage Sharing
              </Link>
            )}
            <button
              disabled={buttonClickedProccesing}
              onClick={handleGenerateVaultReportLogic}
              className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-5 py-2 rounded-md font-medium transition">
              Generate Vault Report
            </button>
            <button
              disabled={buttonClickedProccesing}
              onClick={() => { handleRecentToast() }} 
              className="cursor-pointer bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-medium transition">
              Update Recent Activity
            </button>
          </div>
        </section>
        <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <div className='flex flex-row items-center justify-between'>
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <span id='filterBox' className='flex flex-row items-center gap-2 cursor-pointer'>
              <span>sort By :</span>
              <CustomSelect
                options={sortOptions}
                value={selectedOption}
                onChange={setselectedOption} 
              />
            </span>
          </div>
          <motion.ul
          variants={listContainerVariants}
          initial="hidden"
          animate="visible">
           {RecentActivity.map((activity, index) => (
             <motion.li
               key={index}
               variants={listItemVariants}
               className="flex flex-col sm:flex-row justify-between hover:shadow-lg sm:items-center gap-4 px-5 py-4 bg-white dark:bg-gray-900 rounded-xl shadow-md border-none m-2 dark:border-gray-700 transition-all duration-300"
             >
               <div className="flex m-2 flex-col sm:w-1/4">
                 <span className="text-xs text-gray-500 dark:text-gray-400">Action</span>
                 <span className="text-base font-semibold text-gray-800 dark:text-white">{activity.action}</span>
               </div>
               <div className="flex m-2 flex-col sm:w-1/4">
                 <span className="text-xs text-gray-500 dark:text-gray-400">Time</span>
                 <span className="text-sm text-gray-700 dark:text-gray-300">{activity.when}</span>
               </div>
               <div className="flex m-2 flex-col sm:w-1/4">
                 <span className="text-xs text-gray-500 dark:text-gray-400">Location</span>
                 <span className="text-sm text-gray-700 dark:text-gray-300">{activity.place}</span>
               </div>
               <div className="flex m-2 flex-col sm:w-1/4">
                 <span className="text-xs text-gray-500 dark:text-gray-400">IP Address</span>
                 <span className="text-sm text-gray-700 dark:text-gray-300">{activity.ip}</span>
               </div>
             </motion.li>
           ))}
         </motion.ul>
        </section>
      </main>
        {/* Recent Activity */}
    </div>
  );
}

function VisualCardForStats({ title, children }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -50, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        whileHover={{scale: 1.05,boxShadow:"revert-layer"}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative dark:from-gray-800 dark:to-indigo-900 p-6 rounded-3xl shadow-lg border border-gray-300 dark:border-indigo-700 transition-all duration-500 group cursor-pointer"
      >
        {/* Accent strip */}
        <div className="absolute top-0 left-0 h-full w-1.5 bg-indigo-600 rounded-l-3xl group-hover:bg-indigo-500 transition-colors duration-300"></div>
        {/* Title */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-indigo-200 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors duration-300">
            {title}
          </h2>
          {/* svg container */}
          <div className="group flex flex-col items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-800 shadow-md transition-colors duration-300">
              <svg
                className="w-7 h-7 text-yellow-500 group-hover:text-yellow-600 dark:text-yellow-300 transition-colors duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h10M4 14h6M4 18h4" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 select-none">Activity</p>
          </div>
        </div>
        {/* Chart */}
        <div className="h-64">
          {children}
        </div>
      </motion.div>
    </>
  );
}

