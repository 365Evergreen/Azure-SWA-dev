import { useEffect, useRef, useState, type ReactNode } from 'react';

export default function VisibilitySensor({ children, rootMargin = '200px' }: { children: ReactNode; rootMargin?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    if (inView) return; // already visible
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        obs.disconnect();
      }
    }, { rootMargin });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [inView, rootMargin]);

  return <div ref={ref}>{inView ? children : null}</div>;
}
