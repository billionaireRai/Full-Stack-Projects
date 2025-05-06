import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { handleStartVideoCall } from "@services/chatroomServices.js";
import useSound from "use-sound";
import notification from "@assets/ChatNotification.mp3";
import MessageCard from "./messageCard";
import EmojiPicker from "emoji-picker-react";
import bell from "@assets/bell-alarm.png";
import { ReactComponent as CopyIcon } from "@assets/copyIconSVG.svg";
import { ReactComponent as TickIcon } from "@assets/tickIcon.svg";
import block from "@assets/block-user.png";
import noTalking from "@assets/no-talking.png";
import videoCall from "@assets/cam-recorder.png";
import report from "@assets/report.png";
import favourite from "@assets/wish-list.png";
import Delete from "@assets/delete.png";
import Tooltip from "./Tooltip";
import noMember from "@assets/noMember.png";
import Doter from "./Doter.jsx";
import More from "@assets/more.png";
import User from "@assets/user.png";
import Smile from "@assets/smile.png";
import Crossimage from "@assets/crossImage (1).png";
import Send from "@assets/send.png";
import { toast, ToastContainer, Zoom } from "react-toastify";

const Chatroom = ({ isCopied, setisCopied, handleIdCopy }) => {
  const messageInputTag = useRef();
  const navigate = useNavigate();
  const [Members, setMembers] = useState([]);
  const [Socket, setSocket] = useState();
  const [messageMediaCursor, setmessageMediaCursor] = useState(false);
  const [messageEmojiCursor, setmessageEmojiCursor] = useState(false);
  const [noMessageCursor, setnoMessageCursor] = useState(false);
  const ChatMessageRef = useRef([]); // for making the chat information persistent accros the rerenders...
  const [ChatMessage, setChatMessage] = useState([]);
  const [Message, setMessage] = useState(null);
  const [isInputFocus, setisInputFocus] = useState(false);
  const [UserSearched, setUserSearched] = useState(null);
  const [ClientInfo, setClientInfo] = useState();
  const [messageSent, setmessageSent] = useState(true);
  const [isRotated, setisRotated] = useState([]);

  const [Play] = useSound(notification, { volume: 1, playbackRate: 1 });

  // function for simulating the delay...
  const delay = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  };
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        setClientInfo(parsedUserData);
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    } else {
      console.warn("No userData found in localStorage.");
    }
  }, []);

  const capitalizingFirstLetter = (STRING) => {
    return STRING.charAt(0).toUpperCase() + STRING.slice(1);
  };

  const searchingUserFromTheMembers = () => {
    Members.filter(
      (member) =>
        member.username === String(UserSearched).toLocaleLowerCase() ||
        member.username === String(UserSearched).toUpperCase() ||
        member.username === capitalizingFirstLetter(UserSearched)
    );
  };

  useEffect(() => {
    searchingUserFromTheMembers();
  }, [UserSearched]);

  const handleMessageSendButtonClick = async (msg) => {
    const MSG = String(msg);
    setmessageSent(false); // for making the loader visualize...
    if (MSG.trim() !== "") {
      Socket.emit(
        "sendMessage",
        { message: MSG, chatroomID: ClientInfo.chatroomID },
        (response) => {
          if (response.error) {
            console.error("Error sending message:", response.error);
            toast.error("Failed to send message. Please try again.");
          } else {
            console.log("Message sent successfully:", response);
          }
        }
      );
      setMessage("");
      await delay(2.5); // making the function execution halt intensionally...
      setmessageSent(true);
      Play();
    } else {
      toast.error("Cant send an Empty Message", {
        onClose: () => {
          messageInputTag.current?.focus();
        },
      });
    }
  };

  const createSocketioConnectionForClient = () => {
    const socket = io(
      "https://localhost:6060",
      {
        // credentials as client authenticator for websocket connection...
        auth: {
          chatroomID: ClientInfo.chatroomID,
          username: ClientInfo.username,
        },
      },
      {
        rejectUnauthorized: false,
        secure: true,
        withCredentials: true,
        transports: ["websocket"],
      }
    );
    socket.on("connect", () => {
      console.log("Socket connection established");
    });
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });
    setSocket(socket);
    socket.emit("joinChatroom", ClientInfo.chatroomID);
    socket.emit(
      "Message to Server : New User Joined Chatroom",
      ClientInfo.chatroomID
    );
    socket.on("receiveMessage", (data) => {
      ChatMessageRef.current.push({
        senderName: data.senderid,
        message: data.message,
        timeStamp: data.timestamp,
      });
      setChatMessage([...ChatMessageRef.current]);
    });
    return () => socket.disconnect();
  };

  useEffect(() => {
    if (ClientInfo && ClientInfo.chatroomID) {
      const socket = createSocketioConnectionForClient();

      // Listen for new member joined event
      socket.on("newMemberJoined", (newMemberData) => {
        // Assuming newMemberData contains at least socketId or username
        // Here we add the new member to Members array if not already present
        setMembers((prevMembers) => {
          if (!prevMembers.some((member) => member.socketId === newMemberData.socketId)) {
            return [...prevMembers, newMemberData];
          }
          return prevMembers;
        });
      });

      return () => {
        socket.off("newMemberJoined");
        socket.disconnect();
      };
    }
  }, [ClientInfo]);

  const handleRotationLogic = (index) => {
    if (
      messageInputTag.current &&
      messageInputTag.current === document.activeElement
    ) {
      return;
    }
    setisRotated((prev) => {
      const newRotated = [...prev];
      newRotated[index] = !newRotated[index];
      return newRotated;
    });
    const handleClickOutside = (event) => {
      if (!event.target.closest(".parentOf3Dot")) {
        setisRotated((prev) => {
          const newRotated = [...prev];
          newRotated[index] = false;
          return newRotated;
        });
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  };

  useEffect(() => {
    if (ClientInfo) {
      try {
        setMembers((prevMemArray) => {
          if (
            !prevMemArray.some(
              (member) => member.username === ClientInfo.username
            )
          ) {
            return [...prevMemArray, ClientInfo];
          }
          return prevMemArray;
        });
      } catch (error) {
        console.error("Error parsing userData:", error);
      }
    }
  }, [ClientInfo]);

  return (
    <>
      <ToastContainer autoClose={4000} icon={true} style={{alignItems: "center",color: "black",border: "none",outline: "none", }} hideProgressBar={true} closeOnClick={false} newestOnTop={true} closeButton={true} position="top-right" transition={Zoom}
      />
      <div className="wrapper flex flex-col gap-4 p-4 border sm:flex-row bg-black border-green-100 rounded-md w-screen h-auto">
        <div className="leftContainer border-none border-black w-full h-1/4 rounded-md">
          <div className="leftTop">
            <div className="py-2 px-2">
              <input
                value={UserSearched}
                onChange={(e) => setUserSearched(e.target.value)}
                type="search"
                name="searchUser"
                placeholder="Search for any member..."
                className="w-full h-12 pl-3 pr-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none shadow-sm transition-all duration-200"
              />
            </div>
          </div>
          <div className="membersContainer flex flex-col justify-center items-center gap-2 border-none border-black mx-2 h-3/6 rounded-md">
            {Members.length === 0 ? (
              <>
                <Tooltip height={"40px"} width={"40px"} imgURL={noMember} popUpText={ "Please share your chatroomID from URL to your friends" }
                />
                <span>No Members Are There In your Chatroom</span>
              </>
            ) : (
              <>
                {Members.map((member, index) => (
                  <div key={index} className="w-full border bg-white hover:bg-slate-100 hover:border-slate-200 transition-   duration-300 rounded-lg flex items-center                                              gap-4 p-3 shadow-sm"
                  >
                    {/* Avatar */}
                    <div className="w-14 h-14 flex-shrink-0">
                      <img src={member.avatar.url || User} alt={`${member.username}'s avatar`} className="w-full h-full rounded-full object-cover"
                      />
                    </div>

                    {/* Info Block */}
                    <div className="flex flex-col justify-center flex-grow">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-800 font-semibold text-base">
                          {member.username}
                        </span>
                        <span className="text-sm text-green-600">
                          {isInputFocus ? (
                            <> Typing <Doter interval={1} /> </> ) : ( "Online" )}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {member.thumline}
                      </div>
                    </div>

                    {/* 3-dot Menu */}
                    <div className="relative">
                      <img onClick={() => handleRotationLogic(index)} src={More} alt="More options" className={`w-6 h-6 cursor-pointer transition-transform duration-500`} style={{transform: isRotated[index] ? "rotate(90deg)" : "rotate(0deg)" }}
                      />
                      {/* Dropdown */}
                      {isRotated[index] && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 p-2 space-y-1 text-sm">
                          {!ClientInfo.username ? (
                            <>
                              {[
                                { icon: User, label: "View Profile" },
                                { icon: Send, label: "Send Message" },
                                { icon: favourite, label: "Add to Favorites" },
                                {
                                  icon: videoCall,
                                  label: "Start Video Call",
                                  action: () =>
                                    handleStartVideoCall(member, navigate),
                                },
                                { icon: bell, label: "Mute Notifications" },
                                {
                                  icon: Delete,
                                  label: "Remove Member",
                                  textColor: "text-red-500",
                                },
                                { icon: block, label: "Block User" },
                                { icon: report, label: "Report User" },
                              ].map(({icon,label,action,textColor = "text-gray-700"}) => (
                                  <button key={label} onClick={action} className={`w-full flex items-center gap-3 px-4 py-2 rounded-md hover:bg-gray-100 ${textColor}`}>
                                    <img src={icon} alt={label} className="w-5 h-5"/>
                                    {label}
                                  </button>
                                )
                              )}
                            </>
                          ) : (
                            <>
                              {[
                                { label: "Edit Profile", color: "text-blue-600", hover: "hover:bg-blue-600 hover:text-white"},
                                { label: "Mute Notifications", color: "text-gray-700", hover: "hover:bg-gray-700 hover:text-white"},
                                { label: "Change Status", color: "text-green-600", hover: "hover:bg-green-600 hover:text-white"},
                                { label: "Logout", color: "text-gray-900", hover: "hover:bg-gray-900 hover:text-white"},
                                { label: "Leave Chatroom", color: "text-red-600", hover: "hover:bg-red-600 hover:text-white"},
                              ].map(({ label, color, hover }) => (
                                <button
                                  key={label}
                                  className={`w-full px-4 py-2 text-sm font-medium rounded-md border border-gray-300 bg-white ${color} ${hover} transition duration-300 shadow-sm active:scale-95`}
                                >
                                  {label}
                                </button>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        <div className="rightContainer rounded-md w-full h-auto">
          <div className="border border-black rounded-md overflow-y-scroll bg-black shadow-md shadow-slate-700 w-full h-screen scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800">
            {ChatMessageRef.current.length === 0 ? (
              <div
                onMouseEnter={() => setnoMessageCursor(true)}
                onMouseLeave={() => setnoMessageCursor(false)}
                className="relative cursor-pointer flex flex-row items-center justify-center gap-3 p-5 m-2 text-white border border-gray-500 rounded-lg shadow-lg bg-gray-900/80"
              >
                <div className="flex flex-col items-center">
                  <img src={noTalking} className="invert" width={35} height={35} alt="no chat"/>
                  {noMessageCursor && (
                    <div
                      onMouseEnter={() => setnoMessageCursor(true)}
                      onMouseLeave={() => setnoMessageCursor(false)}
                      className="absolute flex flex-row gap-2 left-1/3 top-20 px-4 py-3 text-sm font-medium items-center text-gray-200 bg-gray-800 border border-gray-600 rounded-md shadow-md "
                    >
                      <span>
                        Let your friends know you're in the Chatroom!!
                      </span>
                      <Tooltip className="invert border" imgURL={CopyIcon} isCopied={isCopied} handleIdCopy={handleIdCopy} TickIcon={TickIcon} popUpText="copy your chatroomID" width={24} height={24}
                      />
                    </div>
                  )}
                </div>
                <div className="text-lg font-semibold tracking-wide text-gray-300 font-poppins">
                  No messages to display...
                </div>
              </div>
            ) : (
              ChatMessageRef.current.map((eachMessageData, index) => (
                <MessageCard key={index + 1} messageData={eachMessageData} ClientInfo={ClientInfo} stateOfMessageSend={messageSent}
                />
              ))
            )}
          </div>
          <div className="messageInputSection bg-gradient-to-r from-gray-900 to-black shadow-lg rounded-lg w-full my-2 p-1">
            <ul className="w-full h-full flex flex-row items-center gap-3 px-2">
              <li
                onClick={() => { setmessageMediaCursor(false); }}
                onMouseEnter={() => { setmessageMediaCursor(true); }}
                onMouseLeave={() => { setmessageMediaCursor(false); }}
                className="cursor-pointer rounded-full bg-gray-800 p-2 transition-transform transform hover:scale-110 relative"
              >
                <img
                  className="filter invert"
                  width={25}
                  height={25}
                  src={Crossimage}
                  alt="plus"
                />
                {!messageMediaCursor && (
                  <div className="absolute z-10 flex flex-col -left-40 -translate-x-1/2 sm:right-0 bottom-12 w-max bg-gray-800 shadow-sm shadow-gray-400 rounded-lg border-none p-2 hover:scale-105 transition-transform">
                    <div className="flex flex-row gap-2 items-center text-left text-white font-semibold">
                      <span>Include Different Media Types 🎵🎥🖼️</span>
                    </div>
                  </div>
                )}
              </li>
              <li
                onClick={() => {
                  setmessageEmojiCursor(false);
                }}
                onMouseEnter={() => {
                  setmessageEmojiCursor(true);
                }}
                onMouseLeave={() => {
                  setmessageEmojiCursor(false);
                }}
                className="cursor-pointer rounded-full bg-gray-800 p-2 transition-transform transform hover:scale-110 relative"
              >
                <img width={25} height={25} className="invert" src={Smile} alt="emoji"
                />
                {!messageEmojiCursor ? (
                  <div className="absolute z-10 flex flex-col left-1/2 -translate-x-1/2 sm:right-0 bottom-12 w-max bg-gray-800 shadow-sm shadow-gray-400 rounded-lg border-none p-2 hover:scale-105 transition-transform">
                    <div className="flex flex-row gap-2 items-center text-left text-white font-semibold">
                      <span>✨ Include Emoji</span>
                    </div>
                  </div>
                ) : (
                  <EmojiPicker
                    className="absolute z-10 flex flex-col left-1/2 -translate-x-1/2 sm:right-0 bottom-38 w-max bg-gray-800 shadow-sm shadow-gray-400 rounded-lg border-none p-2 hover:scale-105 transition-transform"
                    onEmojiClick={(event, emojiObject) => {
                      setMessage((prev) => (prev ? prev + emojiObject.emoji : emojiObject.emoji));
                      messageInputTag.current?.focus();
                    }}
                  />
                )}
              </li>
              <li className="flex-grow">
                <input value={Message} ref={messageInputTag} onChange={(e) => setMessage(e.target.value)} onBlur={() => setisInputFocus(false)} onFocus={() => setisInputFocus(true)} disabled={!messageSent} className={`${
                    !messageSent ? "cursor-wait" : "cursor-auto"
                  } w-full h-12 py-2 px-4 bg-gray-900 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500 transition-all`}
                  placeholder="Enter your message..."
                  type="text"
                />
              </li>
              <li
                onClick={() => {
                  handleMessageSendButtonClick(Message);
                }}
                className="cursor-pointer rounded-full p-2 transition-transform transform hover:scale-90"
              >
                <img className="invert" width={25} height={25} src={Send} alt />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatroom;
