import React,{ useState } from 'react';
import Tooltip from './Tooltip';
import noMember from '@assets/noMember.png'

const Chatroom = () => {
    const [Members, setMembers] = useState([]) ; // array containing members information
    const [ChatMessage, setChatMessage] = useState([]) ;  // array holding chatinformation
    return (
<div className='wrapper flex flex-col gap-4 p-4 border bg-green-100 border-green-100 rounded-md w-screen h-[1300px]'>
    <div className="leftContainer border border-black w-full min-h-44 h-auto rounded-md">
        <div className="leftTop">
            <div className='py-2 px-2'><input type="search" name="searchUser" placeholder='search for any member...' className='w-full h-5 py-4 px-3 rounded-md border-none outline-none focus:shadow-md shadow-black transition-shadow' /></div>
        </div>
        <div className="membersContainer flex flex-row items-center justify-center gap-3 border border-black mx-2 h-2/3 rounded-md">
        <span><Tooltip height={'100px'} width={'100px'} imgURL={noMember} popUpText={"Please give your chatroomID from URL to your friends "}/></span>
        <span>No Members Are There In your Chatroom</span>
        </div>
    </div>
    <div className="rightContainer border-none border-black w-full h-full rounded-md bg-chatInterfaceImage bg-contain bg-center ">

    </div>
        </div>
    );
}

export default Chatroom;
