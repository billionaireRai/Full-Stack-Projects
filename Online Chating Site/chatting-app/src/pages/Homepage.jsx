import { ReactComponent as CopyIcon } from '@assets/copyIconSVG.svg';
import { ReactComponent as TickIcon } from '@assets/tickIcon.svg';
import { ReactComponent as Encryption } from '@assets/encryption.svg';
import { handleJoiningForm, handleCreateChatroomID } from '@services/chatroomServices.js';
import warningImg from '@assets/warning.png';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ToastContainer, Zoom } from 'react-toastify';
import Tooltip from './Tooltip.jsx';

const Homepage = () => {
    const navigate = useNavigate();
    const [isCopied, setisCopied] = useState(false);
    const [chatroomID, setchatroomID] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => { setAvatarPreview(reader.result) };
            reader.readAsDataURL(file);
        }
    };

    const handleIdCopy = () => { 
        navigator.clipboard.writeText(chatroomID);
        setisCopied(true);
        setTimeout(() => { setisCopied(false) }, 4000);
    }

    const onSubmit = async (data) => {
        await handleJoiningForm(data, navigate,chatroomID); // calling the main function...
    }

    return (
        <>
            <ToastContainer autoClose={4000} icon={true} style={{alignItems:'center',color:'black',border:'none',outline:'none'}} hideProgressBar={true} closeOnClick={false} newestOnTop={true} closeButton={true} position='top-right' transition={Zoom} />
            <div className="flex flex-col items-center overflow-x-hidden bg-messagesImage backdrop-filter bg-contain bg-center bg-green-100 rounded-md h-screen w-screen max-w-none p-0 m-0 font-poppins">
                <div className="upperBox flex items-center justify-centre border-none rounded-md h-auto">
                    <h1 className="title text-center py-4 text-2xl font-bold">Welcome to Online Chatting World</h1>
                </div>
                <div className="lowerBox py-3 px-3 flex flex-col items-center shadow-blue-500 border-green-600 shadow-2xl border-none rounded-md w-2/3 h-auto">
                    <div className="py-2 px-3 text-pretty text-lg font-semibold text-center"><h2>Let's connect and engage with your friends!</h2></div>
                    <hr className="mx-4 h-0.5 w-11/12 bg-gray-300 rounded-md shadow-md" />
                    <form className='joiningform border-none border-black w-full h-auto rounded-md' method="post" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col w-full h-auto rounded-md px-2 py-4 ">
                            <span className="title font-bold text-green-600 hover:text-green-800 transition-colors duration-300"><h3 className="font-semibold font-variant-smallcaps tracking-wide">Username</h3></span>
                            <input type="text" placeholder='enter your username' className='username focus:border-2 focus:border-green-500 focus:shadow-sm transition-shadow focus:shadow-green-500 px-1 py-1 border-none outline-none rounded-md' {...register('username', {
                                required: { value: true, message: 'This Field is required for unique recognition...' },
                                minLength: { value: 10, message: 'Username must be at least 10 characters long...' }
                            })} />
                            {errors.username && (
                                <div className='Red flex flex-row items-center text-sm py-2 px-1 space-x-2 text-red-600 font-semibold '><img width={'25px'} height={'25px'} src={warningImg} alt="warning" /><span>{errors.username.message}</span></div>             
                            )}
                        </div>
                        <div className="flex flex-col w-full h-auto rounded-md px-2 py-2 ">
                            <span className='title title font-bold text-green-600 hover:text-green-800 transition-colors duration-300"'><h3 className="font-semibold font-variant-[small-caps] tracking-wide">Thumline</h3></span>
                            <input placeholder='enter line expresses you' type="text" className='thumbline snap-mandatory focus:shadow-sm transition-shadow focus:shadow-green-500 px-1 py-1 border-none outline-none rounded-md' {...register('thumline', {
                                required: { value: true, message: 'Field is required to express you' },
                                maxLength: { value: 50, message: 'Thumline must be at most 50 characters long...' }
                            })} />
                            {errors.thumline && (
                                <div className='Red Red flex flex-row items-center text-sm py-2 px-1 space-x-2 text-red-600 font-semibold'><img width={'25px'} height={'25px'} src={warningImg} alt="warning" /><span>{errors.thumline.message}</span></div>
                            )}
                        </div>
                        <div className="flex flex-col w-full h-auto rounded-md px-2 py-2 ">
                            <span className='title font-bold text-green-600 hover:text-green-800 transition-colors duration-300"'><h3 className="font-semibold font-variant-[small-caps] tracking-wide">Avatar</h3></span>
                            <div className="flex flex-row items-center space-y-2 space-x-5">
                                {avatarPreview && (
                                    <div className="mt-2">
                                        <img src={avatarPreview} alt="Avatar-Preview" className="w-24 h-24 rounded-full object-contain border-2 border-green-500"/>
                                    </div>
                                )}
                                <label className="cursor-pointer w-40 h-10 bg-black hover:bg-gray-800 text-white font-semibold px-4 py-2 rounded-md transition-colors duration-300">
                                    {avatarPreview ? "Change Avatar" :"Choose Avatar"}
                                    <input type="file" className="hidden" {...register('avatar')} onChange={handleAvatarChange} accept="image/*" />
                                </label>
                            </div>
                        </div>
                        <div className="flex flex-col w-full h-auto rounded-md px-2 py-2 ">
                            <span className='title font-bold text-green-600 hover:text-green-800 transition-colors duration-300"'><h3 className="font-semibold font-variant-[small-caps] tracking-wide">Chatroom ID</h3></span>
                            <div className='flex flex-row items-center relative'>
                                <input value={chatroomID} placeholder='enter OR generate a chatroomID' className='chatroomID w-11/12 snap-mandatory focus:shadow-sm transition-shadow focus:shadow-green-500 px-1 py-1 border-none outline-none rounded-md' onChange={(e) => { setchatroomID(e.target.value) }} {...register('chatroomID', {
                                // required: { value: true, message: 'Feild is required to chatroom authentication' },
                                minLength: {value: 35, message: 'Chatroom ID must be atleast 35 characters long...' }
                            })} />
                                <Tooltip imgURL={CopyIcon} isCopied={isCopied} handleIdCopy={handleIdCopy} TickIcon={TickIcon} popUpText="copy your chatroomID" width={24} height={24} />
                            </div>
                            {errors.chatroomID && (
                                <div className='Red Red flex flex-row items-center text-sm py-2 px-1 space-x-2 text-red-600 font-semibold'><img width={'25px'} height={'25px'} src={warningImg} alt="warning" /><span>{errors.chatroomID.message}</span></div>
                            )}
                        </div>
                        <div className="btnSection flex flex-row items-center justify-center mx-2 my-3 space-x-3">
                            <button type={chatroomID ? "submit" : "button"} onClick={() => { !isSubmitting && !chatroomID && handleCreateChatroomID(setchatroomID) }} disabled={isSubmitting} className="btn font-semibold h-12 w-22 px-2 bg-black hover:shadow hover:shadow-slate-900 hover:bg-slate-900 cursor-pointer text-white rounded-md transition-colors duration-300">{chatroomID ? "Create Chatroom" : "Generate Chatroom ID"}</button>
                            <button type='submit' disabled={isSubmitting} className="btn font-semibold h-12 w-22 px-2 bg-white hover:shadow hover:shadow-slate-200 hover:bg-slate-200 cursor-pointer text-black rounded-md transition-colors duration-300">Join Chatroom</button>
                        </div>
                    </form>
                </div>
                <div className='encrytionTag border-none border-black rounded-md flex items-center justify-center py-5 px-3 w-3/4'>
                    <div className='w-3/4 flex flex-row items-center justify-center space-x-3'>
                        <span><Tooltip imgURL={Encryption} height={'25px'} width={'25px'} popUpText={'Nobody outside your Chatroom can read your conversation !!'}/></span>
                        <div className='font-bold text-black'>Chatrooms are End To End encrypted...</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Homepage;
