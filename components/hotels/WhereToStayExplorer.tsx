'use client';

import { useState } from 'react';
import type { StayArea } from '@/lib/hotels/stay-areas';
import { MapPin, Users, Home, ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Props {
  areas: StayArea[];
  destinationName: string;
}

export function WhereToStayExplorer({ areas, destinationName }: Props) {
  const [selectedAreaId, setSelectedAreaId] = useState<string>(areas[0]?.id || '');

  if (!areas.length) return null;

  const selectedArea = areas.find(a => a.id === selectedAreaId) || areas[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[var(--shadow-card)] border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* Left: Neighborhood List */}
        <div className="lg:w-1/3 flex flex-col gap-3">
          <h3 className="text-sm font-700 text-mist uppercase tracking-wider mb-2">Neighborhoods</h3>
          {areas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedAreaId(area.id)}
              className={`text-left px-5 py-4 rounded-xl transition-all border ${
                selectedAreaId === area.id
                  ? 'bg-sand border-primary text-ink shadow-sm'
                  : 'bg-white border-gray-100 text-mist hover:border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-display font-700 ${selectedAreaId === area.id ? 'text-lg text-primary-dark' : 'text-base'}`}>
                  {area.name}
                </span>
                {selectedAreaId === area.id && <ChevronRight size={18} className="text-primary" />}
              </div>
              <p className={`text-xs mt-1 ${selectedAreaId === area.id ? 'text-ink/80' : 'text-mist/80'}`}>
                Best for: {area.bestForTitle || area.bestForList.slice(0, 30) + '...'}
              </p>
            </button>
          ))}
        </div>

        {/* Right: Area Details / Comparison */}
        <div className="lg:w-2/3">
          <div className="bg-sand/30 rounded-2xl p-6 sm:p-8 border border-sand">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-700 text-ink text-balance">
                  {selectedArea.name}
                </h2>
                <p className="text-primary-dark font-700 text-sm mt-2 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Best for {selectedArea.bestForTitle}
                </p>
              </div>
            </div>

            <p className="text-mist leading-relaxed text-sm sm:text-base mb-8">
              {selectedArea.shortDescription}
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2.5 text-ink font-700 mb-2">
                  <Users size={18} className="text-ocean" />
                  <h3>Perfect for</h3>
                </div>
                <p className="text-sm text-mist leading-relaxed">{selectedArea.bestForList}</p>
              </div>
              
              <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2.5 text-ink font-700 mb-2">
                  <Home size={18} className="text-ocean" />
                  <h3>Accommodation Style</h3>
                </div>
                <p className="text-sm text-mist leading-relaxed">{selectedArea.accommodationStyle}</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-mist">
                * Inventory and pricing are subject to availability via our booking partners.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
