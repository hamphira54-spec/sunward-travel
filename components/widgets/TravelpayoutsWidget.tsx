'use client';

import { useEffect, useRef, useState } from 'react';

interface TravelpayoutsWidgetProps {
  src: string;
  className?: string;
}

export default function TravelpayoutsWidget({ src, className = '' }: TravelpayoutsWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // We use an iframe with srcDoc to isolate the Travelpayouts widget from React's DOM.
  // This prevents React StrictMode double-mounts from duplicating scripts, 
  // and ensures the widget's internal document.write or DOM lookups work perfectly.
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <base target="_top">
        <style>
          body { margin: 0; padding: 0; background: transparent; overflow-y: hidden; }
          #widget-container { width: 100%; display: flex; justify-content: center; }
        </style>
      </head>
      <body>
        <div id="widget-container">
          <script async src="${src}" charset="utf-8"></script>
        </div>
        <script>
          // Send height updates to parent window so the iframe can resize dynamically
          const observer = new ResizeObserver((entries) => {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: 'tpwdg-resize', height, src: "${src}" }, '*');
          });
          observer.observe(document.body);
          
          // Fallback interval for widgets that animate or load slowly
          setInterval(() => {
            window.parent.postMessage({ type: 'tpwdg-resize', height: document.body.scrollHeight, src: "${src}" }, '*');
          }, 1000);
        </script>
      </body>
    </html>
  `;

  const [height, setHeight] = useState<number>(500);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'tpwdg-resize' && e.data.src === src) {
        // Add a tiny buffer to prevent scrollbars
        const newHeight = Math.max(e.data.height, 100);
        setHeight(newHeight + 10);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [src]);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <iframe
        srcDoc={html}
        style={{ width: '100%', height: `${height}px`, border: 'none', overflow: 'hidden' }}
        scrolling="no"
        title="Travelpayouts Widget"
      />
    </div>
  );
}
