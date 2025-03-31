import React,{ useState , useEffect , useRef} from 'react';
import { io } from 'socket.io-client';
import useSound from 'use-sound';
import notification from '@assets/ChatNotification.mp3';
import MessageCard from './messageCard';
import bell from '@assets/bell-alarm.png';
import { ReactComponent as CopyIcon } from '@assets/copyIconSVG.svg';
import { ReactComponent as TickIcon } from '@assets/tickIcon.svg';
import block from '@assets/block-user.png';
import noTalking from '@assets/no-talking.png';
import videoCall from '@assets/cam-recorder.png';
import report from '@assets/report.png';
import favourite from '@assets/wish-list.png';
import Delete from '@assets/delete.png' ;
import Tooltip from './Tooltip';
import noMember from '@assets/noMember.png'
import Doter from './Doter.jsx' ;
import More from '@assets/more.png' ;
import User from '@assets/user.png' ;
import Smile from '@assets/smile.png' ;
import Crossimage from '@assets/crossImage (1).png' ;
import Send from '@assets/send.png';
import { toast, ToastContainer,Zoom } from 'react-toastify';

const Chatroom = ({isCopied,setisCopied,handleIdCopy}) => {
    const messageInputTag = useRef() ; 
    const [Members, setMembers] = useState([]); // array containing members information
    const [Socket, setSocket] = useState() ;
    const [messageMediaCursor, setmessageMediaCursor] = useState(false) ;
    const [messageEmojiCursor, setmessageEmojiCursor] = useState(false) ;
    const [noMessageCursor, setnoMessageCursor] = useState(false) ;
    const [ChatMessage, setChatMessage] = useState([
        // {
        //     senderName: 'Amritansh Rai',
        //     message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam, excepturi earum ad nisi suscipit soluta. Suscipit veniam quod nobis amet soluta, repellat delectus qui, nulla quasi minus, provident adipisci necessitatibus voluptas veritatis rerum. Nobis nisi doloremque rem fugit similique quidem!',
        //     date: 'Sat, 15 Mar 2025 13:52:30 GMT',
        //     image: 'https://i.imgur.com/8Q6Qq8C.jpg',
        //     type: 'text',
        // }
    ]); // array holding chat information
    const [Message, setMessage] = useState(null)
    const [isInputFocus, setisInputFocus] = useState(false) ; // targeting input focus state...
    const [UserSearched, setUserSearched] = useState(null) ;
    const [ClientInfo, setClientInfo] = useState() ;
    const [messageSent, setmessageSent] = useState(true) ; // for holding the loading state...
    const [isRotated, setisRotated] = useState([]) ;

    const [ Play ] = useSound(notification, { volume: 1 , playbackRate:1}); // initializing the usesound hook with volume...

useEffect(() => {
    const userData = localStorage.getItem("userData"); // getting data from local storage...
    if (userData) {
        try {
            const parsedUserData = JSON.parse(userData);
            setClientInfo(parsedUserData); // setting clientinfo in a state variable...
        } catch (error) {
            console.error("Error parsing userData:", error);
        }
    } else {
        console.warn("No userData found in localStorage.");
    }
}, []); // runs only once when component mounts..

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
const handleMessageSendButtonClick = (msg) => {
        const MSG = String(msg);
        if (MSG.trim() !== '') {
            Socket.emit('sendMessage', { message: MSG, chatroomID: ClientInfo.chatroomID }, (response) => {
                if (response.error) {
                    console.error('Error sending message:', response.error);
                    toast.error('Failed to send message. Please try again.');
                } else {
                    console.log('Message sent successfully:', response);
                }
            }); // will trigger the sendMessage socket.on()
            setMessage(''); // Clear the input value by state updation...
            setmessageSent(true) // setting the loading state to true...
            Play() // for notification sound...
        } else {
            // error notification of message sent...
            toast.error('Cant send an Empty Message', { onClose: () => {
                  messageInputTag.current?.focus();
                }
              });
        }
    }

    // function handling the socket.io connection logic...
const createSocketioConnectionForClient = () => { 
    const socket = io('https://localhost:6060', { 
        rejectUnauthorized: false, 
        secure: true, 
        withCredentials: true, 
        transports: ['websocket'] // Allow both WebSocket and polling transports
    }); // Update to the correct server URL
    socket.on('connect', () => {
        console.log('Socket connection established');
    });
    socket.on('connect_error', (err) => {
        console.error('Socket connection error:', err); // Log connection errors
    });
        setSocket(socket);
        console.log("Socket connection established"); // Debug log for socket connection...
    // Joining chatroom
     socket.emit('joinChatroom', ClientInfo.chatroomID);
     socket.emit('Message to Server : New User Joined Chatroom', ClientInfo.chatroomID);
    // Listening for incoming messages
     socket.on('receiveMessage', (data) => { // Correct the spelling of 'receive'
            console.log("Received message:", data); // Debug log for received message
            setChatMessage((preMessages) => [
                ...preMessages,
                { senderName: data.sendername, message: data.message, timeStamp: data.timestamp }
            ]);
        });
        return () => socket.disconnect();
    };
    
    useEffect(() => { 
        if (ClientInfo && ClientInfo.chatroomID) {
            createSocketioConnectionForClient();
        }
    }, [ClientInfo]); // Updated dependency array

    // function to handle three dot rotation logic...
const handleRotationLogic = (index) => {
    // Prevent the menu from closing when focusing on the message input
    if (messageInputTag.current && messageInputTag.current === document.activeElement) {
        return;
    }

        setisRotated(prev => { 
            const newRotated = [...prev];
            newRotated[index] = !newRotated[index]; 
            return newRotated;
        });
        // handling click anywhere else (new concept for me)
        const handleClickOutside = (event) => {
            if (!event.target.closest('.parentOf3Dot')) {
                setisRotated(prev => {
                    const newRotated = [...prev];
                    newRotated[index] = false; // Close the popup
                    return newRotated;
                });
            }
        };

    window.addEventListener('click', handleClickOutside);

        // Cleanup the event listener on component unmount or when the popup state changes
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }

    // adding new member details in the Members Array... 
    useEffect(() => {
        if (ClientInfo) {
            try {
                setMembers((prevMemArray) => {
                    if (!prevMemArray.some(member => member.username === ClientInfo.username)) { // using the some operator of array...
                        return [...prevMemArray, ClientInfo]; // Update Members array
                    }
                    return prevMemArray; // Return the existing array if the member already exists
                });
            } catch (error) {
                console.error("Error parsing userData:", error);
            }
        }
    }, [ClientInfo]);
    return (
        <>
        <ToastContainer autoClose={4000} icon={true} style={{alignItems:'center',color:'black',border:'none',outline:'none'}} hideProgressBar={true} closeOnClick={false} newestOnTop={true} closeButton={true} position='top-right' transition={Zoom} />
        <div className='wrapper flex flex-col gap-4 p-4 border sm:flex-row bg-black border-green-100 rounded-md w-screen h-auto'>
            <div className="leftContainer border-none border-black w-full h-1/4 rounded-md">
                <div className="leftTop">
                    <div className='py-2 px-2'>
                    <input value={UserSearched} onChange={(e) => setUserSearched(e.target.value)} type="search" name="searchUser" placeholder="Search for any member..." className="w-full h-12 pl-3 pr-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm transition-all duration-200"/>
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
                        <div className='parentOf3Dot w-8 h-8'>
                          <img className={`transition-transform duration-500  ${isRotated[index] ? 'rotate-90' :'rotate-0'}`} onClick={() => { handleRotationLogic(index) }} src={More} alt="dot"/>
                          {isRotated[index] ? ( !ClientInfo.username && ( 
                             <div className="relative z-10 flex flex-col right-36 top-2 sm:right-0 w-max bg-white shadow-lg rounded-lg border">
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                    <img width="24px" height="24px" src={User} alt="viewProfile" />
                                    <div>View Profile</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                  <img width="24px" height="24px" src={Send} alt="send" />
                                  <div>Send Message</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                  <img width="24px" height="24px" src={favourite} alt="addToFavorites" />
                                  <div>Add to Favorites</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                  <img width="24px" height="24px" src={videoCall} alt="startVideoCall" />
                                  <div>Start Video Call</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                  <img width="24px" height="24px" src={bell} alt="muteNotifications" />
                                  <div>Mute Notifications</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full font-semibold text-red-500 hover:bg-gray-100">
                                  <img className="rounded-full" src={Delete} alt="dustbin" />
                                  <div>Remove Member</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                  <img width="24px" height="24px" src={block} alt="blockUser" />
                                  <div>Block User</div>
                                </button>
                                <button className="transition-all duration-300 p-4 flex flex-row gap-2 items-center text-left rounded-md w-full hover:bg-gray-100">
                                  <img width="24px" height="24px" src={report} alt="reportUser" />
                                  <div>Report User</div>
                                </button>
                              </div>
                              )
                            ) : (
                                ClientInfo.username && (
                                    <div className="relative z-10 flex flex-col right-36 top-2 sm:right-0 w-max bg-white shadow-lg rounded-lg border-none outline-none">
                                        <button className="transition-all duration-300 outline-none px-4 py-2 rounded-md shadow-sm font-medium text-blue-600 bg-white border border-gray-300 hover:bg-blue-600 hover:text-white hover:shadow-md active:scale-95">Edit Profile</button>
                                        <button className="transition-all duration-300 outline-none px-4 py-2 rounded-md shadow-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md active:scale-95">Mute Notifications</button>
                                        <button className="transition-all duration-300 outline-none px-4 py-2 rounded-md shadow-sm font-medum text-green-600 bg-white border border-gray-300 hover:bg-green-600 hover:text-white hover:shadow-md active:scale-95">Change Status</button>
                                        <button className="transition-all duration-300 outline-none px-4 py-2 rounded-md shadow-sm font-medium text-gray-900 bg-white border border-gray-300 hover:bg-gray-900 hover:text-white hover:shadow-md active:scale-95">Logout</button>
                                        <button className="transition-all duration-300 outline-none px-4 py-2 rounded-md shadow-sm font-medium text-red-600 bg-white border border-gray-300 hover:bg-red-600 hover:text-white hover:shadow-md active:scale-95">Leave Chatroom</button>
                                    </div> 
                                )
                                )} 
                        </div>
                    </div>
                ))} 
                    </>)
                }
                </div>
            </div>
            <div className="rightContainer rounded-md w-full h-auto">
                <div className='border border-black rounded-md bg-black shadow-md shadow-slate-700 w-full h-screen'>
                {ChatMessage.length === 0 ? (
                    <div onMouseEnter={() => setnoMessageCursor(true)} onMouseLeave={() => setnoMessageCursor(false)} className="relative cursor-pointer flex flex-row items-center justify-center gap-3 p-5 m-2 text-white border border-gray-500 rounded-lg shadow-lg bg-gray-900/80">
                    <div className="flex flex-col items-center">
                        <img src={noTalking} className="invert" width={35} height={35} alt="no chat" />
                        {noMessageCursor && (
                        <div onMouseEnter={() => setnoMessageCursor(true)} onMouseLeave={() => setnoMessageCursor(false)} className="absolute flex flex-row gap-2 left-1/3 top-20 px-4 py-3 text-sm font-medium items-center text-gray-200 bg-gray-800 border border-gray-600 rounded-md shadow-md ">
                            <span>Let your friends know you're in the Chatroom!!</span>
                            <Tooltip className="invert border" imgURL={CopyIcon} isCopied={isCopied} handleIdCopy={handleIdCopy} TickIcon={TickIcon} popUpText="copy your chatroomID" width={24} height={24} />
                        </div>
                        )}
                    </div>
                    <div className="text-lg font-semibold tracking-wide text-gray-300 font-poppins">
                        No messages to display...
                    </div>
                </div>
                ) : (
                    ChatMessage.map((eachMessageData, index) => (
                        <MessageCard key={index + 1} messageData={eachMessageData} ClientInfo={ClientInfo} stateOfMessageSend={messageSent}
                        />
                    ))
                )}
                </div>
                <div className="messageInputSection bg-gradient-to-r from-gray-900 to-black shadow-lg rounded-lg w-full my-2 p-1">
                    <ul className="w-full h-full flex flex-row items-center gap-3 px-2">
                        <li onMouseEnter={() => { setmessageMediaCursor(true) }} onMouseLeave={() => { setmessageMediaCursor(false) }} className="cursor-pointer rounded-full bg-gray-800 p-2 transition-transform transform hover:scale-110 relative">
                            <img className="filter invert" width={25} height={25} src={Crossimage} alt="plus" />
                             { messageMediaCursor && (
                                <div className="absolute z-10 flex flex-col left-1/2 -translate-x-1/2 sm:right-0 bottom-12 w-max bg-gray-800 shadow-sm shadow-gray-400 rounded-lg border-none p-2 hover:scale-105 transition-transform">
                                    <div className="flex flex-row gap-2 items-center text-left text-white font-semibold">
                                      <span>Include Different Media Types 🎵🎥🖼️</span>
                                    </div>
                                </div>
                             )}
                        </li>
                      <li onMouseEnter={() => { setmessageEmojiCursor(true) }} onMouseLeave={() => { setmessageEmojiCursor(false) }} className="cursor-pointer rounded-full bg-gray-800 p-2 transition-transform transform hover:scale-110 relative">
                          <img width={25} height={25} className='invert' src={Smile} alt="emoji" />
                          { messageEmojiCursor && (
                            <div className="absolute z-10 flex flex-col left-1/2 -translate-x-1/2 sm:right-0 bottom-12 w-max bg-gray-800 shadow-sm shadow-gray-400 rounded-lg border-none p-2 hover:scale-105 transition-transform">
                                <div className="flex flex-row gap-2 items-center text-left text-white font-semibold">
                                    <span>✨ Include Emoji</span>
                                </div>
                            </div>
                          )}
                      </li>
                      <li className="flex-grow">
                          <input
                              value={Message}
                              ref={messageInputTag}
                              onChange={(e) => setMessage(e.target.value)}
                              onBlur={() => setisInputFocus(false)}
                              onFocus={() => setisInputFocus(true)}
                              disabled={!messageSent}
                              className={`${ !messageSent ? 'cursor-wait' : 'cursor-auto' } w-full h-12 py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 transition-all`}
                              placeholder="Enter your message..."
                              type="text"
                          />
                      </li>
                      <li onClick={() => { handleMessageSendButtonClick(Message) }} className="cursor-pointer rounded-full p-2 transition-transform transform hover:scale-90">
                        <img className="invert" width={25} height={25} src={Send} alt />
                      </li>
                  </ul>
              </div>
            </div>
        </div>
        </>
    );
}

export default Chatroom ;
