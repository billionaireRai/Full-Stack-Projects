import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AudioWaveformIcon, Download, LucideEraser, Mic, SendHorizontal, Square, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import toast from 'react-hot-toast';
import Audioplayer from './Audioplayer';
import { MdPreview } from 'react-icons/md';

interface audioProp {
  closePopUp: () => void;
  addAudioInAttachments: (audioBlob: Blob[]) => void;
}

export default function AudioRecordModal({ closePopUp, addAudioInAttachments }: audioProp) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [recordedBlobs, setRecordedBlobs] = useState<Blob[]>([]);
  const [status, setStatus] = useState<'idle' | 'recording...' | 'ready' | 'error'>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const recorderState = useMemo(() => {
    if (!mediaRecorderRef.current) return 'inactive' ;
    return mediaRecorderRef.current.state;
  }, [isRecording]);

  
  // function audio recording logic...
  const startRecordingAudio = async () => {
    try {
      setErrorText(null);
      setStatus('recording...');

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      setRecordedBlobs([]);

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blobs = audioChunksRef.current;
        setRecordedBlobs(blobs);

        const audioBlob = new Blob(blobs, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error starting audio recording:', error);
      setStatus('error');
      setErrorText('Failed to start audio recording. Please check microphone permissions.');
      toast.error('Microphone permission required');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        toast.success('Recording stopped');
        setStatus('ready');
      } catch (e) {
        console.error(e);
        setStatus('error');
        setErrorText('Could not stop recording');
      }
    }
  };

  const clearRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive')  mediaRecorderRef.current.stop();

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;

    audioChunksRef.current = [];
    setRecordedBlobs([]);

    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl('');
    setStatus('idle');
    setErrorText(null);
    setIsRecording(false);
  };

  const sendAudio = () => {
    if (!recordedBlobs.length) return ;
    addAudioInAttachments(recordedBlobs);
    closePopUp();
  };

  // function for status format text...
  function getStatusInFormat() : string {
      switch (status) {
        case 'recording...':
          return 'Recording...'

        case 'ready':
          return 'Audio recorded successfully'

        case 'error':
          return 'Error occured'

        case 'idle':
          return 'inactive'
          
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') mediaRecorderRef.current.stop();

      streamRef.current?.getTracks().forEach((track) => track.stop());

      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs animate-in fade-in-0 zoom-in-95 duration-200">
      <div className="audio_modal w-full max-w-lg rounded-xl bg-white/95 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur dark:bg-black/90 dark:ring-white/10">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-yellow-100 dark:bg-blue-950/30 flex items-center justify-center ring-4 ring-yellow-100 dark:ring-yellow-900/30">
              <AudioWaveformIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Record Audio</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Record and send your voice note</p>
            </div>
          </div>

          <button
            onClick={closePopUp}
            className="p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-950 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <div
              className={`w-14 h-14 rounded-full p-2 flex items-center justify-center ring-1 ring-black/5 ${
                isRecording ? 'bg-yellow-100 animate-pulse' : 'bg-gray-100 dark:bg-gray-900/60'
              }`}
            >
              {isRecording ? (
                <div className="flex items-end space-x-1">
                  <div className="w-1 bg-yellow-500 rounded-lg h-2 animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1 bg-yellow-500 rounded-lg h-4 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 bg-yellow-500 rounded-lg h-8 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 bg-yellow-500 rounded-lg h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <div className="w-1 bg-yellow-500 rounded-lg h-2 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              ) : (
                <Mic className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              )}
            </div>
          </div>

          {errorText && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-2 flex items-center justify-center gap-3 text-xs text-red-700 dark:text-red-200 ring-1 ring-red-200/60 dark:ring-red-900/40">
              <Image src={'/images/warning.png'} height={20} width={20} alt='warning' />
               <span>{errorText}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={startRecordingAudio}
                    disabled={isRecording}
                    className={`p-2 rounded-full transition-colors ${
                      isRecording ? 'bg-yellow-200/50 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer text-white'
                    }`}
                    aria-label="Start recording"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Start</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={stopRecordingAudio}
                    disabled={!isRecording}
                    className={`p-2 rounded-full transition-colors ${
                      !isRecording ? 'bg-gray-200/60 cursor-not-allowed' : 'bg-gray-500 cursor-pointer hover:bg-gray-600 text-white'
                    }`}
                    aria-label="Stop recording"
                  >
                    <Square className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Stop</TooltipContent>
              </Tooltip>
            </div>

            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={clearRecording}
                    disabled={status === 'idle' && !audioUrl}
                    className={`p-2 rounded-full transition-colors ${
                      (status === 'idle' && !audioUrl) ? 'bg-gray-200/60 cursor-not-allowed' : 'bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-black'
                    }`}
                    aria-label="Clear recording"
                  >
                    <LucideEraser className="w-5 h-5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Clear audio</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* audio preview after recording */}
          {audioUrl && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-950/40 ring-1 ring-black/5 dark:ring-white/10">
              <div className="flex items-center justify-between gap-3 mb-3"> 
                <span className="text-xs text-gray-500 dark:text-gray-400 border border-gray-400 py-1 px-2 rounded-full">Format</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 border border-gray-400 py-1 px-2 rounded-full">WebM</span>
              </div>

              <Audioplayer url={audioUrl} />

              <div className="flex items-center justify-end gap-2 mt-4">
                <Link
                  href={audioUrl}
                  download="audio-note.webm"
                  className="inline-flex items-center justify-center px-3 py-2 rounded-md bg-black hover:bg-zinc-950 text-white transition-colors"
                  aria-label="Download recording"
                >
                  <Download size={16} />
                </Link>
                <button
                  onClick={sendAudio}
                  className="inline-flex cursor-pointer items-center justify-center gap-2 px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!recordedBlobs.length}
                >
                  <span>Send Audio</span>
                  <SendHorizontal />
                </button>
              </div>
            </div>
          )}

          <div className="text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <div className='flex flex-col items-start justify-center'>
              <span className='text-sm'>Recording status</span>
              <span className='text-xs font-mono border border-yellow-400 text-yellow-500 bg-yellow-100 rounded-full py-1 px-2'>{getStatusInFormat()}</span>
            </div>
            <div className='flex flex-col items-end justify-center'> 
              <span className='text-sm'>Audio Recorder state</span>
              <span className='text-xs font-mono border border-yellow-400 text-yellow-500 bg-yellow-100 rounded-full py-1 px-2'>{recorderState}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


