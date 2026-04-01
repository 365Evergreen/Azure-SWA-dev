import { VanillaAccordion, type VanillaAccordionItem } from '../VanillaAccordion/VanillaAccordion';

// Example data (same config as Fluent accordion)
const items: VanillaAccordionItem[] = [
  {
    title: "Work from anywhere",
    description: "We help your team members create, connect, and collaborate securely from anywhere.",
    panels: [
      { title: "All your information, all the time", content: "Panel 1 content goes here." },
      { title: "Work with any device", content: "Panel 2 content goes here." },
      { title: "Work in the cloud and offline", content: "Panel 3 content goes here." },
      { title: "Assured governance", content: "Panel 4 content goes here." },
    ],
  },
];

export default function VanillaAccordionDemoPage() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
      <h1>Vanilla Accordion Demo</h1>
      <VanillaAccordion items={items} />
    </main>
  );
}


