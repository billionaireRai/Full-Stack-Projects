import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export default function Audioplayer({ url }:{ url:string }) {
  return (
    <AudioPlayer
      src={url}
      preload="metadata"
      autoPlay={false}
      autoPlayAfterSrcChange={false}
      showJumpControls={false}
      showSkipControls={false}
      progressJumpSteps={{ backward: 5,forward: 5 }}
      layout="horizontal"
      onPlay={() => console.log("playing")}
      onPause={() => console.log("paused")}
      onEnded={() => console.log("finished")}
    />
  )
};