import { Copy, Download, QrCode, X } from 'lucide-react';
import { useState , useEffect, useRef } from 'react';
import Link from 'next/link';
import { QRCodeCanvas } from 'qrcode.react';
import React from 'react'
import axiosInstance from '@/lib/interceptor';
import toast from 'react-hot-toast';

interface QRcodeProps {
  path:string;
  postid?:string
  Category:string;
  owner?:string;
  timestamp:string;
  copyLink:() => void;
  doneScanning:() => void;
}

export default function Qrcodepop ({ path , owner , timestamp , doneScanning , copyLink , postid , Category }:QRcodeProps) {
  const [LoadingQR, setLoadingQR] = useState(false);
  const [verifiedUrl, setverifiedUrl] = useState<string>(''); // for storing url after verification
  const qrRef = useRef<HTMLDivElement>(null);

  // function for QR url verification...
  async function apiForUrlVerification() {
    setLoadingQR(true);
    const verifyApi = await axiosInstance.post('/api/qr/verify',{ category:Category , handle:owner , id:postid , path  });
    if (verifyApi.status === 200) {
      setverifiedUrl(verifyApi.data.URL);
      setLoadingQR(false);
    } else {
      setLoadingQR(false);
      toast.error("Wrong post url found...");
    }
  }

  // function for downloading QR...
  const handleQRdownload = async () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `${Category}-${postid ? postid : owner ? owner : ' '}_qr_code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('QR code not ready. Please try again.');
    }
  };

  useEffect(() => {
   // apiForUrlVerification();
  }, [])

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="bg-white dark:bg-black rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 relative animate-in fade-in-0 zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 p-2 border-b border-gray-100 dark:border-gray-700 rounded-lg">
            <div className="flex items-center justify-center gap-2">
              <QrCode size={30}/>
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>Share Profile Via QR</h2>
            </div>
            <button 
              className="p-1 cursor-pointer text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-950 rounded-full transition-all duration-200"
              onClick={doneScanning}
            >
              <X/>
            </button>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center gap-2 mb-4 p-6 w-full rounded-2xl">
            <div className="w-48 h-48 bg-gray-100 dark:bg-gray-950 rounded-xl flex items-center justify-center mb-6  border-none shadow-lg">
            {LoadingQR ? (
                <div className="flex flex-col items-center justify-center space-y-4 p-8">
                  <div className="w-fit h-fit p-2 border border-yellow-200 border-t-yellow-400 rounded-full animate-pulse bg-gradient-to-br from-yellow-100/50 to-yellow-200/50 backdrop-blur-sm flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </div>
                </div>
              ) : ( 
                <div ref={qrRef} className="text-gray-400 text-3xl font-mono rounded-md p-2">
                  <QRCodeCanvas value={verifiedUrl} className='rounded-lg dark:invert' size={250} level='H' marginSize={1} bgColor="#FFFFFF" fgColor="#000000" />
                </div>
            )}
            </div>
            <p className="text-sm text-black text-center max-w-xs font-semibold dark:text-gray-500">Scan this QR code with your phone's camera to view profile instantly</p>
            <div className='flex text-black dark:text-gray-400 items-center justify-center p-3 gap-2 text-sm w-full'>
              <div><span className='mx-2 text-md font-semibold'>Owner</span><Link href={`/${owner}`}>{owner}</Link></div>
              <div>.</div>
              <div><span className='mx-2 text-md font-semibold'>At Time</span>{timestamp}</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button 
            onClick={copyLink}
            className="cursor-pointer w-full bg-yellow-500 text-white py-3 px-6 rounded-xl font-medium hover:bg-yellow-400 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
              <Copy/>
              <span>Copy Link</span>
            </button>

            <button 
            onClick={() => { handleQRdownload() }}
            className="cursor-pointer w-full bg-black dark:bg-white dark:text-black text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
              <Download/>
              <span>Download QR</span>
            </button>
          </div>
        </div>
      </div>
    )
  }
