import React, { useState } from 'react';
import { ReactComponent as SoftwareLogo } from './assets/softwareLogo.svg';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Tooltip from './pages/Tooltip.jsx';
import Homepage from './pages/Homepage.jsx';
import Chatroom from './pages/Chatroom.jsx';
import Videopage from './pages/Videopage.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Doter from './pages/Doter.jsx' ;
import './App.css';

function App() {
   const navigate = useNavigate() ;
   const [isCopied, setisCopied] = useState(false);
   const [chatroomID, setchatroomID] = useState(null);

   const handleIdCopy = () => { 
      navigator.clipboard.writeText(chatroomID);
      setisCopied(true);
      setTimeout(() => { setisCopied(false) }, 4000);
  }
   return (
      <div className="App w-full h-full mx-0 my-0 overflow-hidden">
         <nav className='bg-black sticky top-0 flex flex-row justify-between text-white rounded-md shadow-xl z-10'>
            <ul className='flex flex-row items-center space-x-2'>
               <li className='cursor-pointer' onClick={() => { navigate('/home') }}><SoftwareLogo/></li>
               <li className='font-poppins font-bold size-auto text-xl py-4 w-auto'>Chattify<Doter interval={0.5} /></li>
            </ul>
            <ul className='flex flex-row items-center space-x-4 mx-1'>
               <li><button onClick={() => { navigate('/login') }} className='active:bg-blue-500 border-1 bg-blue-400 hover:shadow-md hover:shadow-blue-400 font-poppins border-0 border-white rounded-md px-5 py-1'>logIn</button></li>
               <li><button onClick={() => { navigate('/signup') }} className='active:bg-green-500 border-1 bg-green-400 hover:shadow-md hover:shadow-green-400 font-poppins border-0 border-white rounded-md px-5 py-1'>signUp</button></li>
            </ul>
         </nav>
            <Routes>
               <Route path={"/"} element={<Homepage isCopied={isCopied} setisCopied={setisCopied} chatroomID={chatroomID} handleIdCopy={handleIdCopy} />} />
               <Route path={"/home"} element={<Homepage isCopied={isCopied} setisCopied={setisCopied} chatroomID={chatroomID} handleIdCopy={handleIdCopy} />} />
               <Route path={"/signup"} element={<Signup />} />
               <Route path={"/login"} element={<Login />} />
               <Route path="/chatroom/:id" element={<Chatroom isCopied={isCopied} setisCopied={setisCopied} chatroomID={chatroomID} handleIdCopy={handleIdCopy} />} />
               <Route path="/videoroom/:id_1/:id_2" element={<Videopage />} />
               <Route path="/videoroom/:id" element={<Videopage />} />
            </Routes>
      </div>
   );
}
export default App;
