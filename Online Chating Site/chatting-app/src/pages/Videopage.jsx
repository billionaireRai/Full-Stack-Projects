
import { io } from 'socket.io-client';
import React,{ useRef, useState , useEffect} from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor } from 'lucide-react';
import initiateVideoCall from '@services/videoCallService.js';
import { toast , ToastContainer , Zoom } from 'react-toastify';

const Videopage = () => {
    // states getting used in the logic...
    const [micOn, setMicOn] = useState(false);
    const [camOn, setCamOn] = useState(false);
    const [micControlHover, setmicControlHover] = useState(false);
    const [camControlHover, setCamControlHover] = useState(false);
    const [endCallHover, setEndCallHover] = useState(false);
    const [screenShareHover, setScreenShareHover] = useState(false);
    const [DidIOffer, setDidIOffer] = useState(false);

    // references getting involved...
    const remoteVideoSection = useRef() ;
    const localVideoSection = useRef() ; 
    const peerConnection = useRef(null);
    const localStream = useRef(null);
    const remoteStream = useRef(null);

    // function to initiate the videoCalling proccess with the neccessary states...
    useEffect(() => {
        const clientData = {
            username: localStorage.getItem('username') || '',
            chatroomID: localStorage.getItem('chatroomID') || ''
        };
        
        // Initialize socket connection
        const socket = io('https://localhost:6060', {
            auth: {
                chatroomID: clientData.chatroomID,
                username: clientData.username
            },
            rejectUnauthorized: false,
            secure: true,
            withCredentials: true,
            transports: ['websocket']
        });

        // Setup WebRTC event listeners
        socket.on('answer', async (data) => {
            if (peerConnection.current) {
                try {
                    await peerConnection.current.setRemoteDescription(data.answer);
                } catch (error) {
                    console.error("Error setting remote description:", error);
                }
            }
        });

        socket.on('iceCandidate', (data) => {
            if (peerConnection.current && data.candidate) {
                peerConnection.current.addIceCandidate(new RTCIceCandidate(data.candidate))
                    .catch(error => console.error("Error adding ICE candidate:", error));
            }
        });

        initiateVideoCall(
            setDidIOffer,
            DidIOffer,
            localStream,
            remoteStream,
            peerConnection,
            remoteVideoSection,
            localVideoSection,
            clientData,
            socket
        );

        return () => {
            socket.disconnect();
            if (peerConnection.current) {
                peerConnection.current.close();
            }
            if (localStream.current) {
                localStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [])
    // function handle ending of call for a user...
    const handleUserEndingCall = () => {
        toast.loading("Ending Video Call...")
     }
    const handleUserSharingScreen = () => { 
        toast.loading("Sharing Screen...")
     }
    return (
        <>
        <ToastContainer autoClose={4000} icon={true} style={{ alignItems: 'center', color: 'black', border: 'none', outline: 'none' }} hideProgressBar={true} closeOnClick={false} newestOnTop={true} closeButton={true} position='top-right' transition={Zoom} />
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-6xl aspect-video rounded-2xl overflow-hidden bg-black shadow-lg flex">
                {/* remote video section */}
                <div className="flex-1 bg-gray-800 border-none outline-none flex items-center justify-center">
                    <video ref={remoteVideoSection} className="w-full h-full object-cover" autoPlay playsInline></video>
                    <div className="absolute inset-0 flex items-center font-bold font-poppins justify-center text-gray-500 text-xl">
                        Waiting for other members to join...
                    </div>
                </div>
                {/* local video section */}
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-black rounded-md overflow-hidden shadow-md border-none outline-none">
                    <video ref={localVideoSection} className="w-full h-full object-cover" autoPlay muted playsInline></video>
                </div>
            </div>
            {/* Controls */}
            <div className="mt-6 flex gap-4 bg-gray-800 p-4 rounded-xl shadow-xl">
              <div className="flex flex-col items-center gap-2">
                <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-3 rounded-full transition-all ${micOn ? 'bg-green-600' : 'bg-red-600'} hover:scale-105`}
                    onMouseEnter={() => { setmicControlHover(true) }}
                    onMouseLeave={() => { setmicControlHover(false) }}
                >
                    {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </button>
                {micControlHover && (
                    <div className="absolute z-20 -bottom-20 left-[29%] mb-2 bg-gray-800/90 backdrop-blur-md shadow-lg shadow-black/30 rounded-xl px-4 py-3 w-auto max-w-xs transition-all duration-300 hover:scale-105 border border-gray-700">
                        <div className="flex items-center gap-3 text-white text-sm sm:text-base font-medium">
                            <span className="whitespace-nowrap">Toggle Microphone</span>
                        </div>
                    </div>
                )}
              </div>
              <div className="flex flex-col items-center gap-2">
                <button
                    onClick={() => setCamOn(!camOn)}
                    className={`p-3 rounded-full transition-all ${camOn ? 'bg-green-600' : 'bg-red-600'} hover:scale-105`}
                    onMouseEnter={() => { setCamControlHover(true) }}
                    onMouseLeave={() => { setCamControlHover(false) }}
                >
                    {camOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </button>
                {camControlHover && (
                    <div className="absolute z-20 -bottom-4 left-[44%] mb-2 bg-gray-800/90 backdrop-blur-md shadow-lg shadow-black/30 rounded-xl px-4 py-3 w-auto max-w-xs transition-all duration-300 hover:scale-105 border border-gray-700">
                        <div className="flex items-center gap-3 text-white text-sm sm:text-base font-medium">
                            <span className="whitespace-nowrap">Toggle Camera</span>
                        </div>
                    </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                    onClick={() => {handleUserEndingCall()}}
                    className="p-3 rounded-full bg-red-700 hover:scale-105 transition-all"
                    onMouseEnter={() => { setEndCallHover(true) }}
                    onMouseLeave={() => { setEndCallHover(false) }}
                >
                    <PhoneOff className="w-6 h-6" />
                </button>
                {endCallHover && (
                    <div className="absolute z-20 -bottom-4 left-[48%] mb-2 bg-gray-800/90 backdrop-blur-md shadow-lg shadow-black/30 rounded-xl px-4 py-3 w-auto max-w-xs transition-all duration-300 hover:scale-105 border border-gray-700">
                        <div className="flex items-center gap-3 text-white text-sm sm:text-base font-medium">
                            <span className="whitespace-nowrap">End Call</span>
                        </div>
                    </div>
                )}
              </div>

              <div className="flex flex-col items-center gap-2">
                <button
                    onClick={() => {handleUserSharingScreen()}}
                    className="p-3 rounded-full bg-blue-600 hover:scale-105 transition-all"
                    onMouseEnter={() => { setScreenShareHover(true) }}
                    onMouseLeave={() => { setScreenShareHover(false) }}
                >
                    <Monitor className="w-6 h-6" />
                </button>
                {screenShareHover && (
                    <div className="absolute z-20 -bottom-20 left-[60%] mb-2 bg-gray-800/90 backdrop-blur-md shadow-lg shadow-black/30 rounded-xl px-4 py-3 w-auto max-w-xs transition-all duration-300 hover:scale-105 border border-gray-700">
                        <div className="flex items-center gap-3 text-white text-sm sm:text-base font-medium">
                            <span className="whitespace-nowrap">Share Screen</span>
                        </div>
                    </div>
                )}
              </div>
            </div>
        </div>
        </>
    );
};

export default Videopage;
