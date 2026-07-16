'use client'

import React from "react";
import dynamic from "next/dynamic";

import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaVolumeRange,
  MediaPlaybackRateButton,
  MediaPlayButton,
  MediaSeekBackwardButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaFullscreenButton,
} from "media-chrome/react";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export default function Videoplayer({ url,showFullScreenIcon = true }: { url: string; showFullScreenIcon?: boolean }) {
  return (
    <MediaController style={{ width: "100%", height: "100%" }} className="rounded-xl">
      <ReactPlayer
        slot="media"
        src={url}
        style={{ width: "100%", height: "100%" }}
        tabIndex={undefined}
      />

      <MediaControlBar className="mt-1 flex flex-wrap items-center gap-0.5 justify-between rounded-xl bg-black/50 px-3 py-2 text-white backdrop-blur">
        <div className="flex items-center gap-2">
          <MediaPlayButton className="p-1 rounded-full" />
          <MediaSeekBackwardButton seekOffset={10} className="p-1 rounded-full" />
          <MediaSeekForwardButton seekOffset={10} className="p-1 rounded-full" />
          <MediaTimeDisplay showDuration className="p-1 rounded-xl" />
        </div>

        <div className="flex min-w-[140px] flex-1 items-center gap-2">
          <MediaTimeRange className="px-2 rounded-xl" />
        </div>

        <div className="flex items-center gap-2">
          <MediaMuteButton className="p-1 rounded-full" />
          <MediaVolumeRange className="px-2 rounded-xl" />
          <MediaPlaybackRateButton className="p-1 rounded-full" />
          {showFullScreenIcon && <MediaFullscreenButton className="p-1 rounded-full" />}
        </div>
      </MediaControlBar>
    </MediaController>
  );
}

