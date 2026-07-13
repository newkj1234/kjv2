import { useEffect, useRef } from "react";

export default function ProjectModal({ work, onClose, videoOnly = false }) {
  const modalRef = useRef(null);
  const contentRef = useRef(null);
  const touchStartRef = useRef(-1);
  const activeDragRef = useRef(false);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.transform = "";
      contentRef.current.style.transition = "";
    }
  }, [work]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const handleTouchStart = (e) => {
      if (modal.scrollTop <= 0) {
        touchStartRef.current = e.touches[0].clientY;
        activeDragRef.current = true;
      } else {
        touchStartRef.current = -1;
        activeDragRef.current = false;
      }
    };

    const handleTouchMove = (e) => {
      if (!activeDragRef.current || touchStartRef.current === -1) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartRef.current;

      if (diff > 0) {
        if (e.cancelable) {
          e.preventDefault();
        }
        if (contentRef.current) {
          contentRef.current.style.transform = `translateY(${diff}px)`;
          contentRef.current.style.transition = "none";
        }
      }
    };

    const handleTouchEnd = (e) => {
      if (!activeDragRef.current || touchStartRef.current === -1) return;

      const currentY = e.changedTouches[0].clientY;
      const diff = currentY - touchStartRef.current;

      if (diff > 120) {
        onClose();
      } else {
        if (contentRef.current) {
          contentRef.current.style.transform = "";
          contentRef.current.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
        }
      }

      touchStartRef.current = -1;
      activeDragRef.current = false;
    };

    modal.addEventListener("touchstart", handleTouchStart, { passive: true });
    modal.addEventListener("touchmove", handleTouchMove, { passive: false });
    modal.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      modal.removeEventListener("touchstart", handleTouchStart);
      modal.removeEventListener("touchmove", handleTouchMove);
      modal.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onClose]);

  // ESC 키로 닫기

  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === "Escape") {

        onClose();

      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {

      window.removeEventListener("keydown", handleKeyDown);

    };

  }, [onClose]);

  // 모달 열리면 뒤 스크롤 잠금

  useEffect(() => {

    if (work) {

      document.body.style.overflow = "hidden";

    } else {

      document.body.style.overflow = "";

    }

    return () => {

      document.body.style.overflow = "";

    };

  }, [work]);

  if (!work) return null;

  return (

    <div ref={modalRef} className="project-modal" onClick={onClose}>

      <div

        ref={contentRef}

        className={`project-content ${videoOnly ? "video-only" : ""}`}

        onClick={(e) => e.stopPropagation()}

      >

        <button

          className="close-button"

          onClick={onClose}

          aria-label="Close project"

        >

          ✕

        </button>

        <video

          src={work.video}

          controls

          autoPlay

          playsInline

        />

        {!videoOnly && (
          <div className="project-info">

            <h1>{work.title}</h1>

            <p className="project-year">

              {work.year}

            </p>

            <p className="project-medium">

              {work.medium}

            </p>

            <p className="project-venue">

              {work.venue}

            </p>

            {work.text && (

              <p className="project-text">

                {work.text}

              </p>

            )}

            {work.materials?.length > 0 && (

              <div className="project-materials">

                {work.materials.map((item, idx) => (

                  <p key={idx}>{item}</p>

                ))}

              </div>

            )}

            {work.collaborators?.length > 0 && (

              <div className="project-collaborators">

                {work.collaborators.map((person, idx) => (

                  <p key={idx}>{person}</p>

                ))}

              </div>

            )}

          </div>
        )}

      </div>

    </div>

  );

}
