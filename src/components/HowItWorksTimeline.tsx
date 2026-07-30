import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MousePointerClick, UploadCloud, CheckCircle2, Truck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    step: '01',
    title: 'Select Product & Options',
    description: 'Choose your media, paper GSM, finish, or enter custom banner width × height dimensions.',
    icon: <MousePointerClick className="w-6 h-6 text-brand-blue" />,
    color: 'border-brand-blue bg-brand-blue/10'
  },
  {
    step: '02',
    title: 'Upload Artwork / Design',
    description: 'Drag & drop your print-ready PDF, PNG, or JPG file. Don’t have artwork? Request our designer assistance.',
    icon: <UploadCloud className="w-6 h-6 text-brand-green" />,
    color: 'border-brand-green bg-brand-green/10'
  },
  {
    step: '03',
    title: 'Approve Digital Proof',
    description: 'Receive a free high-res 2D digital proof via WhatsApp/Email. Printing commences after your final signal.',
    icon: <CheckCircle2 className="w-6 h-6 text-purple-600" />,
    color: 'border-purple-600 bg-purple-50'
  },
  {
    step: '04',
    title: 'Fast Doorstep Delivery',
    description: 'Damage-proof reinforced packaging dispatched via express priority shipping right to your location.',
    icon: <Truck className="w-6 h-6 text-emerald-600" />,
    color: 'border-emerald-600 bg-emerald-50'
  }
];

export const HowItWorksTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stepElements = containerRef.current?.querySelectorAll('.timeline-step');
      if (stepElements && stepElements.length) {
        gsap.fromTo(
          stepElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      }
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-16 sm:py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-brand-green font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 bg-brand-green/20 rounded-full inline-block mb-3">
            Seamless Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How PrinToday Works in 4 Easy Steps
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-2">
            From design upload to final delivery, experience India’s most hassle-free print platform.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="timeline-step glass-dark p-6 rounded-3xl border border-white/10 relative flex flex-col justify-between hover:border-brand-green/50 transition-colors"
            >
              {/* Step Number Bubble */}
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl border ${item.color} flex items-center justify-center`}>
                  {item.icon}
                </div>
                <span className="text-3xl font-extrabold text-slate-700 font-mono">
                  {item.step}
                </span>
              </div>

              {/* Title & Desc */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
