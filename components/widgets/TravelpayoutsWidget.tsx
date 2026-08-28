'use client';

import { useEffect, useRef } from 'react';

interface TravelpayoutsWidgetProps {
  src: string;
  className?: string;
}

/**
 * Renders a Travelpayouts tpwdg.com widget by dynamically injecting
 * its <script> tag into a container div — the widget detects this
 * and injects its iframe content right alongside it.
 */
export default function TravelpayoutsWidget({ src, className = '' }: TravelpayoutsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any previous widget
    container.innerHTML = '';

    const script = document.createElement('script');
    script.async = true;
    script.charset = 'utf-8';
    script.src = src;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [src]);

  return <div ref={containerRef} className={`w-full overflow-hidden ${className}`} />;
}
