"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import useActiveChatMessages from "../states/activechatmessage";
import { EncryptedMessage, importRespectiveKey, messageDecryptionTopLevel, messageEncryptionTopLevel } from "@/lib/encryption";
import usePublicKey from "../states/accountpublickey";
import useSound from "use-sound";
import { Message } from "../states/activechatmessage";
import type { infoForChatCard } from "@/components/chataccountcard";

interface SendMessageInput {
  message: string;
  mentions?: string[];
  mediaFiles?: File[];
};

interface statusUpdateReq {
  msgidx: string ;
  status: Message['status']
}



type connStatusType = "disconnected" | "connecting" | "connected" | "error" ;

export default function useMessageSocket(chat?: infoForChatCard) {
  const socketRef = useRef<Socket | null>(null);
  const [ play ] = useSound('/audio/notification.mp3')
  const { addMessages , messages } = useActiveChatMessages() ;
  const { publickey } = usePublicKey() ; // getting public key from zustand...
  const { updateMessageStatus } = useActiveChatMessages() ;

  // getting the private key from local storage...
  const privatekeyBase64 = localStorage.getItem("privatekey");

  if (!privatekeyBase64)  console.error("Missing private key !!");

  const [connectionStatus, setConnectionStatus] = useState<connStatusType>("disconnected"); // storing connection status...
  
  const [privateKey, setPrivateKey] = useState<CryptoKey | null>(null);
  
  useEffect(() => {
    async function loadPrivateKey() {
        if(!privatekeyBase64) return ;

        const key = await importRespectiveKey(privatekeyBase64,"private");
        setPrivateKey(key);
    }

    loadPrivateKey();

  }, [privatekeyBase64]);

  // establishing connection only once...
  useEffect(() => {
    if (!chat || !publickey || !privateKey) return ;
    
    setConnectionStatus("connecting"); // updating connection state...

    const socket = io("http://localhost:5000", { autoConnect: true, transports: ["websocket"] });

    socketRef.current = socket ;

    const onConnect = () => setConnectionStatus("connected");
    const onDisconnect = () => setConnectionStatus("disconnected");
    const onConnectError = () => setConnectionStatus("error");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // catching message...
    const onCatchMessage = async ({ encryptedMsg , msgID }:{ encryptedMsg:EncryptedMessage , msgID:string }) => {
      try {
        const decryptedText = await messageDecryptionTopLevel(encryptedMsg, privateKey, false);
        // Push msg into zustand state...
        const catchedMsg: Message = {
          id:String(messages.length) ,
          sendername:chat.name,
          senderhandle:chat.handle,
          text: decryptedText,
          timestamp: new Date().toLocaleString(),
          isOwn: false,
          avatar: chat?.avatarUrl,
          status: "sent",
        };
        addMessages([catchedMsg]);
        play();

        // socket request emition for status updation...
        socket.emit('message_final_update',{ sent:'delivered' , msgidx:msgID });
      } catch (e) {
        console.error("Failed to decrypt incoming message", e);
      }
    };

    socket.on("catch_message", onCatchMessage);

    socket.on('message_status_update', (payload:statusUpdateReq) => {
      const { msgidx , status } = payload ;
      updateMessageStatus(msgidx,status) ;
    });

    socket.on("message_status_update_final",(payload:statusUpdateReq) => { 
      const { msgidx , status } = payload ; // getting the data out of payload...
      updateMessageStatus(msgidx,status);
    })


    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("catch_message", onCatchMessage);
      socket.off('message_status_update');

      socket.disconnect();
      socketRef.current = null;
      setConnectionStatus("disconnected");
    };
  }, [chat, publickey, privateKey]);

  const sendMessage = useCallback( async (payload: SendMessageInput) => {
      if (!chat) throw new Error("Chat is not selected");
      if (!publickey) throw new Error("Missing public key");
      if (!privateKey) throw new Error("Missing private key");
      if (!socketRef.current) throw new Error("Socket not connected");

      const trimmed = payload.message?.trim();
      if (!trimmed) return ;

      const receiverPubKey = await importRespectiveKey(chat.publicKeyReciever,"public");

      const encryptedmsg = await messageEncryptionTopLevel(trimmed,publickey,receiverPubKey);

      socketRef.current.emit("send_message", {
        conversationId: chat.id,
        encryptedMessage: encryptedmsg,
        mediaFiles:payload.mediaFiles,
        mentions: payload.mentions,
      });
    },
    [chat, publickey, privateKey, chat?.publicKeyReciever]
  );

  return { sendMessage , connectionStatus } ;
}

