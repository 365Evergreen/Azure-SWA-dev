import React from "react";
import "./ResponsiveVideoPlayer.module.css";

interface ResponsiveVideoPlayerProps {
  src: string;
  title?: string;
  aspectRatio?: string; // e.g. "16:9" or "4:3"
  allowFullScreen?: boolean;
  style?: React.CSSProperties;
}


const isDirectVideo = (src: string) => /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);

const ResponsiveVideoPlayer: React.FC<ResponsiveVideoPlayerProps> = ({
  src,
  title = "Video Player",
  aspectRatio = "16:9",
  allowFullScreen = true,
  style = {},
}) => {
  // Calculate width and height
  const width = 750;
  const [w, h] = aspectRatio.split(":").map(Number);
  const height = Math.round(width * (h / w));

  return (
    <div
      className="responsive-video-player"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: 0,
        padding: 0,
        ...style,
      }}
    >
      {isDirectVideo(src) ? (
        <video
          src={src}
          title={title}
          controls
          className="responsive-video-player__iframe"
          width={width}
          height={height}
        >
          Sorry, your browser does not support embedded videos.
        </video>
      ) : (
        <iframe
          src={src}
          title={title}
          allowFullScreen={allowFullScreen}
          className="responsive-video-player__iframe"
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default ResponsiveVideoPlayer;
