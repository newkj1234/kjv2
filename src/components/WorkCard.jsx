import { useEffect, useRef, useState } from "react";

export default function WorkCard({ work, onClick, className = "" }) {
  const videoRef = useRef(null);
  const hoveredRef = useRef(false);
  const [hovered, setHovered] = useState(false);

  const previewStart = work.previewStart ?? 10;
  const previewEnd = work.previewEnd ?? 20;
  const playRequestRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
  }, []);

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
    seekPreviewStart(video);

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

    seekPreviewStart(video);
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
        className={`work-poster ${hovered ? "hide" : ""}`}
      />

      <video
        ref={videoRef}
        src={work.video}
        className={`work-video ${hovered ? "show" : ""}`}
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
                transitionDelay: hovered ? `${index * 25}ms` : "0ms"
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
