import { useEffect, useRef, useState } from "react";

export default function WorkCard({ work, onClick, className = "" }) {
  const videoRef = useRef(null);
  const hoveredRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  const previewStart = work.previewStart ?? 10;
  const previewEnd = work.previewEnd ?? 20;
  const playRequestRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";

    const setStart = () => {
      video.currentTime = previewStart;
    };

    const handleSeeked = () => {
      setVideoLoaded(true);
    };

    video.addEventListener("loadedmetadata", setStart, { once: true });
    video.addEventListener("seeked", handleSeeked, { once: true });

    if (video.readyState >= 2) {
      video.currentTime = previewStart;
      setVideoLoaded(true);
    } else if (video.readyState === 1) {
      setStart();
    }

    return () => {
      video.removeEventListener("loadedmetadata", setStart);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, [previewStart]);

  const seekPreviewStart = (video) => {
    if (!video) return;

    try {
      video.currentTime = previewStart;
    } catch {
      // ignore seek errors
    }
  };

  const playPreview = async (video) => {
    if (!video) return;

    video.muted = true;
    video.preload = "auto";

    if (playRequestRef.current) {
      playRequestRef.current = null;
    }

    const playPromise = video.play();
    playRequestRef.current = playPromise;

    try {
      await playPromise;
      if (playRequestRef.current !== playPromise) return;
    } catch (err) {
      if (err?.name !== "AbortError" && err?.name !== "NotAllowedError") {
        console.warn("Preview play failed:", err);
      }
    } finally {
      if (playRequestRef.current === playPromise) {
        playRequestRef.current = null;
      }
    }
  };

  const handleEnter = () => {
    const video = videoRef.current;
    if (!video) return;

    hoveredRef.current = true;
    setHovered(true);

    if (video.readyState >= 2) {
      playPreview(video);
      return;
    }

    const handleReady = async () => {
      video.removeEventListener("loadedmetadata", handleReady);
      video.removeEventListener("canplay", handleReady);
      if (!hoveredRef.current) return;
      await playPreview(video);
    };

    video.addEventListener("loadedmetadata", handleReady, { once: true });
    video.addEventListener("canplay", handleReady, { once: true });
    video.load();
  };

  const handleLeave = () => {
    const video = videoRef.current;
    hoveredRef.current = false;
    setHovered(false);

    if (!video) return;
    if (playRequestRef.current) {
      playRequestRef.current = null;
    }

    try {
      video.pause();
    } catch {
      // ignore pause errors
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.currentTime >= previewEnd) {
      seekPreviewStart(video);
    }
  };

  return (
    <article
      className={`work-card ${hovered ? "hovered" : ""} ${className}`}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <img
        src={work.poster}
        alt={work.title}
        className={`work-poster ${videoLoaded ? "hide" : ""}`}
      />

      <video
        ref={videoRef}
        src={work.video}
        className={`work-video ${videoLoaded ? "show" : ""}`}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
      />

      <div className="work-title-overlay">
        <h3 className="work-title-text">
          {work.title.split("").map((char, index) => (
            <span
              key={index}
              className="work-title-char"
              style={{
                animationDelay: hovered ? `${index * 6}ms` : "0ms"
              }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h3>
      </div>
    </article>
  );
}
