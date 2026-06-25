'use client'

import React, { useEffect, useState } from 'react';
import Mediacontrols from './mediacontrols';
import Videoplayer from './videoplayer';
import Audioplayer from './Audioplayer';

export interface mediaType {
  url: string;
  media_type: string;
}

interface mediasizetype {
  height: number;
  width: number;
}

interface modalProps {
  closepop: () => void;
  media: mediaType;
}

export default function Mediapopmodal({ closepop, media }: modalProps) {
  const isVideo = media?.media_type === 'video';
  const isAudio = media?.media_type === 'audio';

  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closepop(); // pop close logic...

      // zoom logic...
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))));
      if (e.key === '-' || e.key === '_') setZoom((z) => Math.max(0.2, Number((z - 0.1).toFixed(2))));
      if (e.key === '0') setZoom(1);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closepop]);

  const handleZoomIn = () => setZoom((z) => Math.min(3, Number((z + 0.2).toFixed(2))));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, Number((z - 0.2).toFixed(2))));
  const handleResetZoom = () => setZoom(1);


  return (
    <div
      className="fixed inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      onClick={closepop}
    >
      <div className="relative p-2 flex rounded-lg items-center justify-center w-full h-full">
        <div
          onClick={(e) => { e.stopPropagation(); }}
          className="flex flex-col gap-1 items-center justify-center h-full group rounded-lg"
        >
          <div
            className="min-w-full w-auto h-4/5 relative rounded-xl object-contain transform-gpu transition-transform duration-150"
            style={{ transform: `scale(${zoom})` }}
          >
            {isVideo ? (
              <div className="w-full h-full">
                <Videoplayer url={media?.url} showFullScreenIcon={false} />
              </div>
            ) : isAudio ? (
               <div className="w-full h-fit absolute bottom-10">
                <Audioplayer url={media?.url} />
               </div>
            ) : (
              <img src={media?.url} alt="Media" className="w-full h-full rounded-xl object-contain" />
            )}
          </div>

          <div className="controls opacity-0 group-hover:opacity-80 hover:opacity-100 transition-transform duration-300">
            <Mediacontrols
              media={media}
              resetZoom={handleResetZoom}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

