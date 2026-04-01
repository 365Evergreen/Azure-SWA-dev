import React, { useEffect, useRef, useState } from 'react';
import styles from './AudioPlayer.module.css';

type AudioPlayerProps = {
  src: string;
  title?: string;
  autoplay?: boolean;
  loop?: boolean;
};

function formatTime(seconds: number) {
  if (!isFinite(seconds) || seconds <= 0) return '0:00';
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  const m = Math.floor(seconds / 60);
  return `${m}:${s}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, title = 'Audio', autoplay = false, loop = false }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<boolean>(autoplay);
  const [current, setCurrent] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [muted, setMuted] = useState<boolean>(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration || 0);
    const onTime = () => setCurrent(audio.currentTime || 0);
    const onEnd = () => setPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }, [playing]);

  const togglePlay = () => setPlaying(p => !p);

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (audioRef.current) audioRef.current.currentTime = val;
    setCurrent(val);
  };

  const onVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value));

  return (
    <div className={styles.player}>
      <div className={styles.topRow}>
        <div className={styles.title}>{title}</div>
        <div style={{ marginLeft: 'auto' }} className={styles.time}>{formatTime(current)} / {formatTime(duration)}</div>
      </div>

      <div className={styles.controls}>
        <button type="button" aria-label={playing ? 'Pause' : 'Play'} className={styles.playButton} onClick={togglePlay}>
          {playing ? '▌▌' : '▶'}
        </button>

        <input
          className={styles.progress}
          type="range"
          min={0}
          max={Math.max(duration, 0)}
          step={0.01}
          value={current}
          onChange={onSeek}
          aria-label="Seek"
        />

        <div className={styles.muteRow}>
          <button type="button"  aria-label={isMuted ? 'Unmute' : 'Mute'} className={styles.smallBtn} aria-pressed={muted ? 'true' : 'false'} onClick={() => setMuted(v => !v)}>
          {muted ? '🔇' : '🔊'}
          </button>
          <input className={styles.volume} type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={onVolume} aria-label="Volume" />
        </div>
      </div>

      <audio ref={audioRef} src={src} preload="metadata" loop={loop} />
    </div>
  );
};

export default AudioPlayer;
