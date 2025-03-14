import React,{ useState , useEffect} from 'react';
import MessageCard from './messageCard';
import useSound from 'use-sound';
import notification from '@assets/ChatNotification.mp3';
import Tooltip from './Tooltip';
import noMember from '@assets/noMember.png'
import Doter from './Doter.jsx' ;
import More from '@assets/more.png' ;
import User from '@assets/user.png' ;
import Smile from '@assets/smile.png' ;
import Crossimage from '@assets/crossImage (1).png' ;
import Send from '@assets/send.png';

const Chatroom = () => {
    const currentDate = new Date() ; // storing the currentdate...
    const [Members, setMembers] = useState([]); // array containing members information
    const [ChatMessage, setChatMessage] = useState([]); // array holding chat information
    const [isInputFocus, setisInputFocus] = useState(false) ; // targeting input focus state...
    const [UserSearched, setUserSearched] = useState(null) ;
    const [messageSent, setmessageSent] = useState(false) ; // for holding the loading state...
    const [isRotated, setisRotated] = useState(false) ;
    const [ Play ] = useSound(notification, { volume: 1 , playbackRate:1}); // initializing the usesound hook with volume...

    const userData = localStorage.getItem("userData"); // getting data from local storage...

    // function to capitalize first letter of the string...
    const capitalizingFirstLetter = (STRING) => {
        return STRING.charAt(0).toUpperCase() + STRING.slice(1);
    }
    // sorting users from Members array based on the searched member...
    const searchingUserFromTheMembers = () => {
     Members.filter((member) => member.username === String(UserSearched).toLocaleLowerCase() || member.username === String(UserSearched).toUpperCase() || member.username === capitalizingFirstLetter(UserSearched))
    
}
    useEffect(() => {
        searchingUserFromTheMembers() // calling this function whenever the UserSearched is getting changed...
    }, [UserSearched])
    
     // function to handle message sending logic...
     const handleMessageSendButtonClick = () => { 
         Play() ; // Play the notification sound when the message is sent
    
      }
    // adding new member details in the Members Array... 
    useEffect(() => {
        if (userData) {
            try {
                const parsedUserData = JSON.parse(userData); // Parse userData from string to JSON...
                setMembers((prevMemArray) => {
                    if (!prevMemArray.some(member => member.username === parsedUserData.username)) { // using the some operator of array...
                        return [...prevMemArray, parsedUserData]; // Update Members array
                    }
                    return prevMemArray; // Return the existing array if the member already exists
                });
            } catch (error) {
                console.error("Error parsing userData:", error);
            }
        }
    }, [userData]);

    return (
        <div className='wrapper flex flex-col gap-4 p-4 border sm:flex-row bg-green-100 border-green-100 rounded-md w-screen h-auto'>
            <div className="leftContainer border-none border-black w-full h-1/4 rounded-md">
                <div className="leftTop">
                    <div className='py-2 px-2'>
                        <input value={UserSearched} onChange={(e) => { setUserSearched(e.target.value) }} type="search" name="searchUser" placeholder='search for any member...' className='w-full h-5 py-4 px-3 rounded-md border-none outline-none focus:shadow-md shadow-black transition-shadow' />
                    </div>
                </div>
                <div className="membersContainer flex flex-col justify-center items-center gap-2 border-none border-black mx-2 h-3/6 rounded-md">
                    {Members.length === 0 ? (
                        <>
                            <Tooltip height={'40px'} width={'40px'} imgURL={noMember} popUpText={"Please share your chatroomID from URL to your friends"} />
                            <span>No Members Are There In your Chatroom</span>
                        </>
                    ) : (
                    <>
                    { Members.map((member, index) => (
                    <div key={index+1} className='w-full h-full border bg-white border-white cursor-pointer hover:bg-slate-100 hover:border-slate-100 transition-all duration-300 rounded-md flex flex-row gap-1 items-center px-1 py-1'>
                        <div className="profilePicContainer"><img src={ member.avatar.url ? member.avatar.url : User} alt="pic" className='border-none border-black w-auto h-14 rounded-full' /></div>
                        <div className='border-none border-black w-full h-full rounded-md'>
                            <span className='border-none border-black text-gray-700 mx-2 font-semibold'>{member.username}</span>
                            <span className='border-none border-black text-green-600'>{ isInputFocus ? <>Typing<Doter interval={1}/></> : "Online" }</span>
                            <div className='border-none text-gray-500 border-black mx-2 text-sm'>{member.thumline}</div>
                        </div>
                        <div className='w-8 h-8'><img className={`transition-transform duration-500 ${isRotated ? 'rotate-90' :'rotate-0'}`} onClick={() => { setisRotated(!isRotated) }} src={More} alt="dot"/></div>
                    </div>
                ))}
                    </>)
                    }
                </div>
            </div>
            <div className="rightContainer rounded-md w-full h-auto">
                <div className='border border-black rounded-md bg-black shadow-md shadow-slate-700 w-full h-screen'>
                    <MessageCard dateOfMessageSend={currentDate.toUTCString()} stateOfMessageSend={messageSent}/>
                </div>
                <div className="messageInputSection bg-gradient-to-r from-gray-900 to-black shadow-lg rounded-lg w-full my-2 p-1">
                    <ul className="w-full h-full flex flex-row items-center gap-3 px-2">
                        <li className="cursor-pointer rounded-full bg-gray-800 p-2 transition-transform transform hover:scale-110">
                            <img className="filter invert" width={25} height={25} src={Crossimage} alt="plus" />
                        </li>
                        <li className="cursor-pointer rounded-full bg-gray-800 p-2 transition-transform transform hover:scale-110">
                          <img width={25} height={25} className='invert' src={Smile} alt="emoji" />
                        </li>
                        <li className="flex-grow">
                          <input
                            onBlur={() => setisInputFocus(false)}
                            onFocus={() => setisInputFocus(true)}
                            className="w-full h-12 py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 transition-all"
                            placeholder="Enter your message..."
                            type="text"
                            name="mainInput"
                          />
                        </li>
                        <li onClick={handleMessageSendButtonClick} className="cursor-pointer rounded-full p-2 transition-transform transform hover:scale-90">
                          <img className="invert" width={30} height={30} src={Send} alt="sendIcon" />
                        </li>
                      </ul>
                </div>
            </div>
        </div>
    );
}

export default Chatroom ;
