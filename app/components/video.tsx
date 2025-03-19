"use client";
import { useEffect, useRef } from "react";

export default function VideoComponent() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Try to autoplay video
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => console.log("Video autoplay started successfully."))
          .catch((error) => console.error("Autoplay was prevented:", error));
      }

      // Force loop manually if browser doesn't respect "loop" attribute
      video.onended = () => {
        video.currentTime = 0; // Reset time to start
        video.play(); // Play again
      };
    }
  }, []);

  return (
    <div className="w-full max-w-7xl">
      <video
        ref={videoRef}
        className="w-full h-auto rounded-xl shadow-xl"
        autoPlay
        loop // This is still here, but we add backup JS logic
        muted
        playsInline
      >
        <source src="/sample.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
