import { useState, useRef, useEffect } from "react";
import ProjectModal from "./ProjectModal.jsx";

export default function WorksList({ works }) {
  const [selectedWork, setSelectedWork] = useState(null);

  // Filter only ID 14 and 13 as requested for now
  const filteredWorks = works
    .filter((w) => w.id === 14 || w.id === 13)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="works-page-list">
      {filteredWorks.map((work) => (
        <WorkItem key={work.id} work={work} onSelect={setSelectedWork} />
      ))}

      {selectedWork && (
        <ProjectModal
          work={selectedWork}
          onClose={() => setSelectedWork(null)}
          videoOnly={true}
        />
      )}
    </div>
  );
}

function WorkItem({ work, onSelect }) {
  const videoRef = useRef(null);
  const { previewStart, previewEnd } = work;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset loop
    video.currentTime = previewStart;
    
    const handleTimeUpdate = () => {
      if (video.currentTime >= previewEnd) {
        video.currentTime = previewStart;
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    
    // Play loop continuously
    video.play().catch(() => {});

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [previewStart, previewEnd]);

  // screenshots
  const screenshots = work.id === 13 
    ? ["/images/works/w13_1.png", "/images/works/w13_2.png", "/images/works/w13_1.png", "/images/works/w13_2.png"]
    : ["/images/works/w14_1.png", "/images/works/w14_2.png", "/images/works/w14_1.png", "/images/works/w14_2.png"];

  // varied widths
  const imgWidths = ["300px", "450px", "360px", "520px"];

  return (
    <article className="works-list-item">
      <header className="works-list-header">
        <h2 className="works-list-title">{work.title}</h2>
        <span className="works-list-year">{work.year}</span>
      </header>

      {/* Horizontal scroll container */}
      <div className="works-media-scroll">
        <div className="works-media-track">
          <div className="works-video-wrapper" onClick={() => onSelect(work)}>
            <video
              ref={videoRef}
              src={work.video}
              muted
              playsInline
              loop
              preload="auto"
              className="works-loop-video"
            />
            <div className="works-video-play-overlay">
              <span className="play-icon">▶</span>
            </div>
          </div>

          {screenshots.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${work.title} screenshot ${idx + 1}`}
              className="works-screenshot"
              style={{ width: imgWidths[idx] }}
            />
          ))}
        </div>
      </div>

      {/* Description below */}
      <div className="works-list-desc">
        <p className="works-list-text">{work.text}</p>
        {work.materials && work.materials.length > 0 && (
          <div className="works-list-materials">
            {work.materials.map((mat, i) => (
              <span key={i} className="material-tag">{mat}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
