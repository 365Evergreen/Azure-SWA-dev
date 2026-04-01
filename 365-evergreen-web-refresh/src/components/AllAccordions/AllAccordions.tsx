import React, { useState, useMemo } from "react";
import { useAllAzureAccordions } from "../../lib/useAllAzureAccordions";
import { VanillaAccordion } from "../VanillaAccordion/VanillaAccordion";

const AllAccordions: React.FC = () => {
  const allAccordions = useAllAzureAccordions();
  // Get unique features
  const features = useMemo(() => Array.from(new Set(allAccordions.map(acc => acc.feature).filter(Boolean))), [allAccordions]);
  const [selectedFeature, setSelectedFeature] = useState(features[0] ?? "");
  const accordions = allAccordions.filter(acc => acc.feature === selectedFeature);
  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: 32 }}>
      <h1>All accordions</h1>
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {features.map((feature, idx) => (
          <button
            key={feature + "-" + idx}
            type="button"
            className={selectedFeature === feature ? "appButton feature-accordion-btn feature-accordion-btn--active" : "appButton feature-accordion-btn"}
            style={{
              padding: "0.5em 1.2em",
              borderRadius: 10,
              border: selectedFeature === feature ? "2px solid #0078d4" : "1px solid #ccc",
              background: selectedFeature === feature ? "#0078d4" : "#fff",
              color: selectedFeature === feature ? "#fff" : "#181828",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: selectedFeature === feature ? "0 2px 8px rgba(0,120,212,0.08)" : "none",
              transition: "all 0.18s",
            }}
            onClick={() => setSelectedFeature(feature ?? "")}
          >
            {feature}
          </button>
        ))}
      </div>
      {accordions.map((acc, id) => {
        const item = {
          ...acc,
          // ensure shape matches VanillaAccordionItem
          title: (acc as any).title ?? acc.feature ?? `Accordion ${id + 1}`,
          panels: (acc as any).panels ?? [],
        } as any;

        return (
          <section key={acc.id + "-" + id} style={{ marginBottom: "2.5rem" }}>
            <div style={{ fontWeight: 600, fontSize: "1.2rem", marginBottom: "0.5rem" }}>
              Feature: <span style={{ color: "#0078d4" }}>{acc.feature}</span> | Label: <span style={{ color: "#333" }}>{item.title}</span>
              {item.id && (
                <>
                  {' '}| lbl: <span style={{ color: "#888" }}>{item.label}</span>{' '}| ID: <span style={{ color: "#888" }}>{item.parentFeatureId}</span>
                </>
              )}
            </div>
            <VanillaAccordion items={[item]} />
          </section>
        );
      })}
    </main>
  );
};

export default AllAccordions;
