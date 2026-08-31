'use client';
import { useEffect } from 'react';
import { trackContentView } from '@/lib/analytics/events';
import type { BaseEventParams } from '@/lib/analytics/types';

interface ViewTrackerProps {
  type: 'destination' | 'guide' | 'news' | 'event' | 'stay_area';
  slug: string;
  params?: BaseEventParams;
}

export default function ViewTracker({ type, slug, params }: ViewTrackerProps) {
  useEffect(() => {
    // Avoid re-triggering if only component mounts, though React 18 strict mode double-fires.
    // It's acceptable for standard GA implementations unless highly strictly filtered.
    trackContentView(type, slug, params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, slug]);
  
  return null;
}
