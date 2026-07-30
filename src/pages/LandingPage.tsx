import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CoreCategoryGrid } from '../components/CoreCategoryGrid';
import { BestSellersCarousel } from '../components/BestSellersCarousel';
import { HowItWorksTimeline } from '../components/HowItWorksTimeline';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { Testimonials } from '../components/Testimonials';
import { FaqSection } from '../components/FaqSection';

export const LandingPage: React.FC = () => {
  return (
    /**
     * Mobile  (<md): CoreCategoryGrid FIRST (order-1), HeroSection SECOND (order-2)
     * Desktop (≥md): HeroSection FIRST (md:order-1), CoreCategoryGrid SECOND (md:order-2)
     */
    <main className="flex flex-col">
      <div className="order-2 md:order-1">
        <HeroSection />
      </div>
      <div className="order-1 md:order-2">
        <CoreCategoryGrid />
      </div>
      <div className="order-3">
        <BestSellersCarousel />
      </div>
      <div className="order-4">
        <HowItWorksTimeline />
      </div>
      <div className="order-5">
        <WhyChooseUs />
      </div>
      <div className="order-6">
        <Testimonials />
      </div>
      <div className="order-7">
        <FaqSection />
      </div>
    </main>
  );
};
