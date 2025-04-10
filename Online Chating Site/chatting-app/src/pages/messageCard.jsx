import React from 'react';
import loader from '@assets/loadingAnimation.webm'
import User from '@assets/user.png';
import Check from '@assets/check.png';

const MessageCard = ({stateOfMessageSend , messageData ,ClientInfo}) => {
  return (
    <div className='mainContainer rounded-2xl mx-4 my-3 p-3 sm:p-2 bg-slate-300 text-white flex items-start gap-4 shadow-lg shadow-slate-800'>
      <div className="picBox border-none flex-shrink-0">
        <img 
          // src={ ClientInfo.avatar && ClientInfo.avatar.url ? ClientInfo.avatar.url : User } 
          src={ User } 
          alt="User Pic" 
          className='w-10 h-10 rounded-full border-none border-black' 
        />
      </div>
      <div className="messageBox flex flex-col border-none w-full gap-2">
        <div className="text-lg font-semibold border-none text-black">{ClientInfo.username}</div>
        <div className="text-sm bg-gray-800 p-3 rounded-lg border-none border-gray-800 leading-relaxed">
          {messageData.message}
        </div>
        <span className='timeNotation border flex flex-row items-center lg:w-1/2 xl:w-2/5 gap-2 ml-auto w-2/3 px-1 py-1 rounded-md border-none text-center font-bold text-black text-xs'>
        <div>{messageData.timeStamp}</div>
        <div>{stateOfMessageSend ? <img width={'25px'} height={'25px'} src={Check} alt="doneSending" /> : <><video autoPlay loop muted width={'20px'} height={'20px'} src={loader} ></video></>}</div>
        </span>
      </div>
    </div>
  );
};

export default MessageCard;
