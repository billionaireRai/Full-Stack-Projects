import React,{ useEffect, useState , useRef } from 'react';
import { X , Mic , Square , Play , SendIcon , Download } from 'lucide-react' ;
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface audioProp {
    closePopUp?:() => void
}

export default function audioRecordModal ({ closePopUp }:audioProp) {
  // defining some required states...
  const [isRecording, setisRecording] = useState(false) ;
  const [AudioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);


  
  // function audio recording logic...
  const startRecordingAudio = async () => {
    try {
      // getting the stream for audio...
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // making instance of mediaRecorder...
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // collecting audio chunks for the audiochunk array...
      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      // stopping audio recording...
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        // Stop all tracks to free resources
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setisRecording(true);
      toast.success('Audio Recording Started !!');
    } catch (error) {
      console.error('Error starting audio recording:', error);
      toast.error('Failed to start audio recording. Please check your microphone permissions.');
    }
  }

  // function to stop audio recording...
  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setisRecording(false);
      toast.success('Audio Recording Stopped !!');
    }
  }
  

  return (
     <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
            <div className="audio_modal bg-white dark:bg-black rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Record Audio</h3>
        <button onClick={closePopUp} className="p-2 cursor-pointer rounded-full hover:bg-gray-100 dark:hover:bg-gray-950">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-center mb-6">
        <div className={`w-12 h-12 p-2 ${isRecording ? "animate-pulse" : 'animate-none'} bg-red-500 rounded-full flex items-center justify-center`}>
          {isRecording ? (
            <div className="flex items-end space-x-1">
              <div className="w-1 bg-white rounded-lg h-2 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 bg-white rounded-lg h-4 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-white rounded-lg h-6 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 bg-white rounded-lg h-4 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1 bg-white rounded-lg h-2 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </div>
      </div>
      <div className='flex flex-col'>
        <div className="flex justify-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button 
                onClick={() => { startRecordingAudio()}}
                className="p-2 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600">
                <Mic className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Start Recording</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={stopRecordingAudio}
                className="p-2 cursor-pointer bg-gray-500 text-white rounded-full hover:bg-gray-600">
                <Square className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Stop Recording</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              {AudioURL && (
              <button 
                className="p-2 cursor-pointer bg-purple-500 text-white rounded-full hover:bg-purple-600">
                <SendIcon className="w-5 h-5" />
              </button>
              )}
            </TooltipTrigger>
            <TooltipContent>Send Audio</TooltipContent>
          </Tooltip>
        </div>
        {AudioURL && (
        <div className="mt-6 p-4 bg-gray-50 dark:bg-black rounded-lg flex flex-col items-center justify-center">
          <audio src={AudioURL} controls className="w-full mb-3" />
          <Link href={AudioURL} download="recording.webm" className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            <span>Download Recording</span>
          </Link>
        </div>
      )}
      </div>
    </div>
    </div>
  )
}

