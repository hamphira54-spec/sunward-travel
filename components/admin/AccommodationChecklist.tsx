'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface AccommodationChecklistProps {
  formRef: React.RefObject<HTMLFormElement | null>;
}

export default function AccommodationChecklist({ formRef }: AccommodationChecklistProps) {
  const [category, setCategory] = useState('travel-guide');
  const [hasDestination, setHasDestination] = useState(false);
  const [hasOverview, setHasOverview] = useState(false);
  const [hasAreas, setHasAreas] = useState(false);
  const [hasMetadata, setHasMetadata] = useState(false);

  useEffect(() => {
    const checkCompleteness = () => {
      if (!formRef.current) return;
      const form = formRef.current;
      const formData = new FormData(form);
      
      const currentCategory = formData.get('category') as string;
      setCategory(currentCategory || 'travel-guide');

      if (currentCategory !== 'where-to-stay') return;

      const dest = formData.get('destinationSlug') as string;
      setHasDestination(!!dest);

      const bodyStr = formData.get('body') as string;
      let hasOverviewBlock = false;
      let hasStayAreaBlock = false;
      if (bodyStr) {
        try {
          const blocks = JSON.parse(bodyStr);
          hasOverviewBlock = blocks.some((b: any) => b.type === 'heading' && b.id === 'overview');
          hasStayAreaBlock = blocks.some((b: any) => b.type === 'stay_area');
        } catch (e) {
          // ignore parsing error during edit
        }
      }
      setHasOverview(hasOverviewBlock);
      setHasAreas(hasStayAreaBlock);

      const seoStr = formData.get('seo') as string;
      let validSeo = false;
      if (seoStr) {
        try {
          const seo = JSON.parse(seoStr);
          validSeo = !!(seo.title && seo.description);
        } catch(e) {}
      }
      
      setHasMetadata(validSeo);
    };

    // Initial check
    checkCompleteness();

    // Re-check when form changes
    const formEl = formRef.current;
    if (formEl) {
      formEl.addEventListener('change', checkCompleteness);
    }
    
    // Also poll every 1s just in case custom components don't bubble change events
    const interval = setInterval(checkCompleteness, 1000);

    return () => {
      if (formEl) {
        formEl.removeEventListener('change', checkCompleteness);
      }
      clearInterval(interval);
    };
  }, [formRef]);

  if (category !== 'where-to-stay') return null;

  const items = [
    { id: 'dest', label: 'Destination assigned', done: hasDestination },
    { id: 'overview', label: 'Overview heading (id: "overview")', done: hasOverview },
    { id: 'areas', label: 'At least 1 Stay Area block', done: hasAreas },
    { id: 'meta', label: 'SEO Title & Description', done: hasMetadata },
  ];

  const score = items.filter(i => i.done).length;
  const total = items.length;
  const isComplete = score === total;

  return (
    <div className="bg-white border border-[#E9D9CA] rounded-lg p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-bold text-[#2B221C] font-serif border-b border-[#E9D9CA] pb-3">Accommodation Checklist</h2>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-start gap-2 text-sm">
            {item.done ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            ) : (
              <Circle className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
            )}
            <span className={item.done ? 'text-gray-800' : 'text-gray-500'}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className={`mt-4 pt-4 border-t border-[#E9D9CA] flex items-center gap-2 text-sm font-medium ${isComplete ? 'text-green-600' : 'text-[#E8622C]'}`}>
        {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        Completeness Score: {Math.round((score / total) * 100)}%
      </div>
    </div>
  );
}
