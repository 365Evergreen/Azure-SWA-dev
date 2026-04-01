import React, { useState, useMemo } from "react";
import { useAllAzureAccordions } from "../../lib/useAllAzureAccordions";
import { VanillaAccordion } from "../VanillaAccordion/VanillaAccordion";
import styles from './AllAccordions.module.css';

const AllAccordions: React.FC = () => {
  const allAccordions = useAllAzureAccordions();
  // Get unique features
  const features = useMemo(() => Array.from(new Set(allAccordions.map(acc => acc.feature).filter(Boolean))), [allAccordions]);
  const [selectedFeature, setSelectedFeature] = useState(features[0] ?? "");
  const accordions = allAccordions.filter(acc => acc.feature === selectedFeature);
  return (
    <main className={styles.root}>
      <h1>All accordions</h1>
      <div className={styles.filters}>
        {features.map((feature, idx) => (
          <button
            key={feature + "-" + idx}
            type="button"
            className={`appButton ${styles.featureAccordionBtn} ${selectedFeature === feature ? styles.featureAccordionBtnActive : ''}`}
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
          <section key={acc.id + "-" + id} className={styles.section}>
            <div className={styles.meta}>
              Feature: <span className={styles.featureName}>{acc.feature}</span> | Label: <span className={styles.itemLabel}>{item.title}</span>
              {item.id && (
                <>
                  {' '}| lbl: <span className={styles.metaMuted}>{item.label}</span>{' '}| ID: <span className={styles.metaMuted}>{item.parentFeatureId}</span>
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
