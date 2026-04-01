import { useEffect, useState } from 'react';

export interface FeatureButton {
  feature: string;
  label: string;
  accordion: number;
  accordionLabel: string;
}

export function useFeatureButtons(): FeatureButton[] {
  const [buttons, setButtons] = useState<FeatureButton[]>([]);

  useEffect(() => {
    fetch('https://365evergreendev.blob.core.windows.net/365evergreen/accordions/feature-buttons.json')
      .then(res => res.json())
      .then(setButtons);
  }, []);

  return buttons;
}
