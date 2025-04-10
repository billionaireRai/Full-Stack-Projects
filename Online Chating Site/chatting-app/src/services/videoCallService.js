import { io } from "socket.io-client";
// socket.io server connection
const clientData = {
    username: localStorage.getItem('username') || '',
    chatroomID:localStorage.getItem('currentChatroomID') || ''
};
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

// STUN server configuration for peerConnection
const PeerConfiguration = {
    iceServers: [
        {
            urls: [ "stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302" ] 
        }
    ]
};

// Function to fetch user media
const fetchUserMedia = async (localVideoRef, localStreamRef) => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        });
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
        }
        localStreamRef.current = stream;
        return stream;
    } catch (error) {
        console.error("Error fetching user media:", error);
        throw error;
    }
};

// Main video call initialization function
const initiateVideoCall = async (setDidIOffer,DidIOffer,localStreamRef,remoteStreamRef,peerConnectionRef,remoteVideoRef,localVideoRef,ClientInfo
) => {
    try {
        // Get user media
        await fetchUserMedia(localVideoRef, localStreamRef);
        // Create peer connection
        peerConnectionRef.current = new RTCPeerConnection(PeerConfiguration);
        remoteStreamRef.current = new MediaStream();
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current;
        }

        // Add local tracks to connection
        localStreamRef.current.getTracks().forEach(track => {
            peerConnectionRef.current.addTrack(track, localStreamRef.current);
        });

        // ICE candidate handler
        peerConnectionRef.current.onicecandidate = (e) => {
            if (e.candidate) {
                socket.emit('iceCandidate', {
                    candidate: e.candidate,
                    username: ClientInfo.username,
                    didIOffer: DidIOffer
                });
            }
        };

        // Track handler for remote stream
        peerConnectionRef.current.ontrack = (e) => { e.streams[0].getTracks().forEach(track => {
                remoteStreamRef.current.addTrack(track);
            });
        };

        // Create offer if initiator
        if (DidIOffer) {
            try {
                const offer = await peerConnectionRef.current.createOffer();
                await peerConnectionRef.current.setLocalDescription(offer);
                socket.emit('offer', {
                    offer,
                    username: ClientInfo.username
                });
                setDidIOffer(true);
            } catch (error) {
                console.error("Error creating offer:", error);
                setDidIOffer(false);
            }
        }

        return () => {
            // Cleanup function
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
            }
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    } catch (error) {
        console.error("Error initializing video call:", error);
        throw error;
    }
};

export default initiateVideoCall;
