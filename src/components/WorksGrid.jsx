import WorkCard from "./WorkCard.jsx";

export default function WorksGrid({ works, onSelect }) {
  return (
    <section className="works-wrapper">
      <section className="works-grid">
        {works.map((work, index) => {
          const patternIndex = index % 10;
          let layoutClass = "";
          
          if (patternIndex === 0 || patternIndex === 1 || patternIndex === 2) {
            layoutClass = "layout-3-col";
          } else if (patternIndex === 3 || patternIndex === 4) {
            layoutClass = "layout-2-col";
          } else if (patternIndex === 5 || patternIndex === 6) {
            layoutClass = "layout-1-col-short";
          } else {
            // 7, 8, 9
            layoutClass = "layout-3-col";
          }

          return (
            <WorkCard
              key={work.id}
              work={work}
              className={layoutClass}
              onClick={() => onSelect?.(work)}
            />
          );
        })}
      </section>
    </section>
  );
}
