"use client";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface AudioPlayerProps {
  url: string;
}

export default function Audioplayer({ url }: AudioPlayerProps) {
  return (
    <div className="w-full">
      <div
        className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl  dark:bg-zinc-950"
      >
        <AudioPlayer
          src={url}
          preload="metadata"
          autoPlay={false}
          autoPlayAfterSrcChange={false}
          showJumpControls={false}
          showSkipControls={false}
          progressJumpSteps={{ backward: 5, forward: 5 }}
          layout="stacked"
          onPlay={() => console.log("playing audio")}
          onPause={() => console.log("paused audio")}
          onEnded={() => console.log("finished audio")}
          className="custom-audio-player"
        />
      </div>
    </div>
  );
}


