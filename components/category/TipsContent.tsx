import { LightbulbIcon, type LucideIcon } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import FlightPathDivider from '@/components/ui/FlightPathDivider';

interface Tip {
  icon?: LucideIcon;
  heading: string;
  body: string;
}

interface TipsContentProps {
  heading: string;
  intro?: string;
  tips: Tip[];
}

export default function TipsContent({ heading, intro, tips }: TipsContentProps) {
  return (
    <section className="section-padding bg-sand" aria-labelledby="tips-heading">
      <div className="container-wide max-w-4xl">
        <ScrollReveal>
          <h2 id="tips-heading" className="font-display font-700 text-2xl sm:text-3xl text-ink mb-2">
            {heading}
          </h2>
          <FlightPathDivider className="mb-6" />
          {intro && (
            <p className="text-mist leading-relaxed mb-8">{intro}</p>
          )}
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tips.map(({ icon: Icon = LightbulbIcon, heading: tipHeading, body }, i) => (
            <ScrollReveal key={tipHeading} delay={i * 0.08}>
              <div className="bg-white rounded-xl p-6 shadow-[var(--shadow-card)] border-l-4 border-ocean">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-lg bg-ocean/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={18} className="text-ocean" />
                  </div>
                  <div>
                    <h3 className="font-display font-700 text-base text-ink mb-1.5">
                      {tipHeading}
                    </h3>
                    <p className="text-sm text-mist leading-relaxed">{body}</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
