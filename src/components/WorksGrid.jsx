import WorkCard from "./WorkCard.jsx";

export default function WorksGrid({ works, onSelect }) {
  const heroWork = works.find(w => w.id === 13);
  
  // Custom sorting logic for the rest of the works
  const customOrder = [4, 6, 5, 12, 7, 9, 8, 10, 2, 1, 3, 11, 14];
  const orderedOtherWorks = [];
  
  // First add items that match customOrder
  customOrder.forEach(id => {
    const found = works.find(w => w.id === id);
    if (found && id !== 13) {
      orderedOtherWorks.push(found);
    }
  });

  // Then append any additional items that are not in customOrder (for future proofing)
  works.forEach(w => {
    if (w.id !== 13 && !customOrder.includes(w.id)) {
      orderedOtherWorks.push(w);
    }
  });

  return (
    <section className="works-wrapper">
      <section className="works-grid">
        {heroWork && (
          <WorkCard
            work={heroWork}
            className="layout-hero-col"
            onClick={() => onSelect?.(heroWork)}
          />
        )}
        {orderedOtherWorks.map((work, index) => {
          let layoutClass = "";
          
          if (index === 0 || index === 1 || index === 2) {
            // Row 2: ID 4, 6, 5
            layoutClass = "layout-3-col";
          } else if (index === 3) {
            // Row 3: ID 12 (Not to Become a Rotting Corpse)
            layoutClass = "layout-1-col-short";
          } else if (index === 4 || index === 5) {
            // Row 4: ID 7, 9
            layoutClass = "layout-2-col";
          } else if (index === 6 || index === 7 || index === 8) {
            // Row 5: ID 8, 10, 2
            layoutClass = "layout-3-col";
          } else if (index === 9 || index === 10) {
            // Row 6: ID 1, 3
            layoutClass = "layout-2-col";
          } else if (index === 11) {
            // Row 7: ID 11 (Entleeren)
            layoutClass = "layout-1-col-short";
          } else {
            // Row 8: ID 14
            layoutClass = "layout-1-col-tall";
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
