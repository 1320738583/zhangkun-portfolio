import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';

const Grainient = lazy(() => import('./Grainient'));

export default function DeferredGrainient(props) {
  const hostRef = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection?.saveData;
    if (reducedMotion || saveData) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setActive(true);
      observer.disconnect();
    }, { threshold: 0.01 });
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return <div ref={hostRef} className="grainient-deferred">
    {active && <Suspense fallback={null}><Grainient {...props} /></Suspense>}
  </div>;
}
