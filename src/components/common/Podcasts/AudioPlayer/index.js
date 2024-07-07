import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
function AudioPlayer({ audioSrc, image }) {
  const audioRef = useRef();
  const isPlayingRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(isPlayingRef.current);
  const [isMute, setIsMute] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const handleVolume = (e) => {
    setVolume(e.target.value);
    audioRef.current.volume = e.target.value;
    setIsMute(false);
  };
  const handleDuration = (e) => {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
  };
  const togglePlay = () => {
    if(isPlaying){
      setIsPlaying(false);
      isPlayingRef.current = false;
    }else{
      setIsPlaying(true)
      isPlayingRef.current = true;
    }
    
  };
  const toggleMute = () => setIsMute(!isMute);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  const handleLoadedMeatadata = () => {
    setDuration(audioRef.current.duration);
    if(isPlayingRef.current){
      audioRef.current.play()
    }else{
      audioRef.current.pause()
    }
  };
  const handleEnded = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMeatadata);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMeatadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  useEffect(() => {
    if (!isMute) {
      audioRef.current.volume = volume;
    } else {
      audioRef.current.volume = 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMute]);
  return (
    <div className="custom-audio-player">
      <img src={image} alt="" className="display-image-player" />

      <audio ref={audioRef} src={audioSrc} />
      <p className="audio-btn" onClick={togglePlay}>
        {" "}
        {isPlaying ? <FaPause /> : <FaPlay />}
      </p>

      <div className="duration-flex">
        <p>{formatTime(currentTime)}</p>
        <input
          type="range"
          className="duration-range"
          onChange={handleDuration}
          max={duration}
          min={0}
          step={0.01}
          value={currentTime}
        />
        <p>{formatTime(duration - currentTime)}</p>
        <p onClick={toggleMute}>
          {!isMute ? <FaVolumeUp /> : <FaVolumeMute />}
        </p>
        <input
          type="range"
          className="volume-range"
          onChange={handleVolume}
          max={1}
          min={0}
          step={0.01}
        />
      </div>
    </div>
  );
}

export default AudioPlayer;
