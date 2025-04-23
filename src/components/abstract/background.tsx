'use client';

import { useState, useEffect } from 'react';

export function Background() {
  
  const [phase, setPhase] = useState<'day'|'eve'>(() => {
    const h = new Date().getHours();
    return (h >= 18 || h < 6) ? 'eve' : 'day';
  });

  useEffect(() => {
    const id = setInterval(() => {
      const h = new Date().getHours();
      setPhase((h >= 18 || h < 6) ? 'eve' : 'day');
    }, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
    <div
      className={`
        fixed inset-0 bg-cover bg-no-repeat bg-center
        ${phase === 'day' ? 'bg-day' : 'bg-eve'}
        z-[-1] blur-sm transition-colors duration-1000
      `}
    />
    <div
      className={`
        fixed inset-0 bg-cover bg-no-repeat bg-center
        ${phase === 'day' ? 'bg-day' : 'bg-eve'}
        z-[-2] transition-colors duration-1000
      `}
    />
    </div>
  );
}
