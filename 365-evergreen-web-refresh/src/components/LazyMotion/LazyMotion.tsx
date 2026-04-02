import { useEffect, useState } from 'react';

type AnyProps = Record<string, any>;

function prefersReducedMotion() {
  try {
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {
    return false;
  }
}

export function LazyAnimatePresence({ children, ...rest }: AnyProps) {
  const [AP, setAP] = useState<any>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let mounted = true;
    import('framer-motion').then(mod => {
      if (mounted) setAP(() => mod.AnimatePresence);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (prefersReducedMotion()) return <>{children}</>;
  if (!AP) return <>{children}</>;
  const Comp = AP;
  return <Comp {...rest}>{children}</Comp>;
}

export function MotionDiv(props: AnyProps) {
  const { children, ...rest } = props;
  const [M, setM] = useState<any>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let mounted = true;
    import('framer-motion').then(mod => {
      if (mounted) setM(() => mod.motion?.div || mod.motion);
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  if (prefersReducedMotion() || !M) {
    // If motion not loaded yet or reduced motion preference, render a plain div
    return <div {...rest}>{children}</div>;
  }

  const Motion = M;
  return <Motion {...rest}>{children}</Motion>;
}

export default MotionDiv;
