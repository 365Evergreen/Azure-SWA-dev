import React, { useState, useRef } from 'react';
import styles from './AudioPlayer.module.css';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setPlaying(true);
      }).catch(() => {
        setPlaying(false);
      });
    }
  };

  return (
    <div className={styles.player}>
      <audio ref={audioRef} src={src} muted={muted} />
      <button
        type="button"
        aria-label={playing ? 'Pause' : 'Play'}
        aria-pressed={playing}
        className={styles.playButton}
        onClick={togglePlay}
      >
        {playing ? '▌▌' : '▶'}
      </button>
      <input
        type="button"
        aria-label={muted ? 'Unmute' : 'Mute'}
        className={styles.smallBtn}
        aria-pressed={muted}
        onClick={() => setMuted(v => !v)}
        value={muted ? '🔇' : '🔊'}
      />
    </div>
  );
};

export default AudioPlayer;