import React from 'react';
import Link from 'next/link';
import { Compass, Flame, ShieldAlert, Sprout, Scale } from 'lucide-react';

export default function WhySection() {
  return (
    <section id="the-why" className="bg-[#07080a] text-ink py-24 px-6 md:px-16 border-t border-line/80 relative">
      <div className="max-w-5xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-gold uppercase tracking-[0.25em] text-xs font-semibold block mb-3 font-mono">
            The Architect&apos;s Thesis &bull; Life&apos;s Work
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-normal tracking-tight text-white leading-tight">
            Why We Are Building This in <span className="text-gold font-normal">Bella Coola</span>
          </h2>
          <div className="w-20 h-[1px] bg-gold/70 mt-6" />
        </div>

        {/* Lead Narrative */}
        <div className="space-y-6 text-muted text-lg leading-relaxed mb-16">
          <p>
            Most people look at the world today and point their fingers at outside &ldquo;evils.&rdquo; They blame guns, they blame the internet, they blame television, and now they blame AI. <strong className="text-white font-medium">Where others see evil tools, I see individuals refusing to take ownership of their own decisions.</strong>
          </p>
          <p>
            When you look at the 7 Laws of the Universe and the work I&apos;ve done, it is evident that we are our own mindset. Owning that is the closest thing to building a real relationship with the universe. Everything has polarity: on one end, a gun can kill; on the other end, it feeds our families. The real danger isn&apos;t the object—it is a person&apos;s refusal to take responsibility for the energy they put into it.
          </p>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Pillar 1 */}
          <div className="card p-8 hover:border-gold/50 transition-colors">
            <Scale className="w-7 h-7 text-gold mb-5" />
            <h3 className="text-xl font-serif font-medium text-white mb-3">
              1. Sovereign Ownership
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              You cannot outsource your mindset. Whether dealing with a rifle, a business system, or artificial intelligence, the outcome reflects the operator. We strip away external excuses so individuals take complete ownership of their actions.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="card p-8 hover:border-emerald/60 transition-colors">
            <Sprout className="w-7 h-7 text-emerald mb-5" />
            <h3 className="text-xl font-serif font-medium text-white mb-3">
              2. The Natural Order
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              When Europeans arrived in Canada, they called the Natives &ldquo;savages&rdquo; and tried to rewire them. Now, those same modern societies are burning out and trying to get back to the exact nature-connected lifestyle they nearly erased.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="card p-8 hover:border-gold/50 transition-colors">
            <ShieldAlert className="w-7 h-7 text-gold mb-5" />
            <h3 className="text-xl font-serif font-medium text-white mb-3">
              3. The AI Catalyst
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              AI is a threat only because humans aren&apos;t showing sovereign responsibility toward it. If a loving universe handed us this technology, then the threat of not being ready is the exact push we need to evolve as spiritual beings.
            </p>
          </div>

        </div>

        {/* Deep Dive: The Lake of Fire & Energy Wiring */}
        <div className="bg-gradient-to-br from-[#12141c] to-[#0c1613] border-l-2 border-gold p-8 md:p-10 mb-16 rounded-r-lg border-y border-r border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-5 h-5 text-gold" />
            <span className="text-xs uppercase tracking-[0.2em] text-gold font-semibold font-mono">
              The Crisis of Unanchored Energy
            </span>
          </div>
          <p className="text-ink text-base md:text-lg leading-relaxed mb-4 italic font-serif">
            &ldquo;If we are energy beings, what happens when our wires cross? Look at the depression and anxiety people already suffer from today. Could the &lsquo;lake of fire&rsquo; simply be another way of saying you couldn&apos;t handle what was coming—so much truth and acceleration that, without being grounded, we cannot live with ourselves and we self-implode from the sheer force of the wave?&rdquo;
          </p>
          <p className="text-muted text-sm leading-relaxed">
            How dare we mock our ancestors when their push is what got us here. If we don&apos;t learn what true love and personal responsibility actually mean, we won&apos;t withstand the weight of the future we are building.
          </p>
        </div>

        {/* The Long-Term Horizon */}
        <div className="card p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-gold/30 bg-gradient-to-br from-charcoal to-[#181a10]">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-emerald text-xs uppercase tracking-[0.2em] font-semibold font-mono">
              <Compass className="w-4 h-4" />
              <span>The 40-Year Horizon</span>
            </div>
            <h4 className="text-2xl font-serif text-white font-normal">
              From Field Charters to a Global Rehabilitation Center
            </h4>
            <p className="text-muted text-sm leading-relaxed">
              This portal is the beginning. We are building toward a year-round rehabilitation center and eco-village at the edge of the woods and water—honoring Nuxalk heritage, welcoming open debate, stress-testing these truths against time, and preparing sovereign individuals whom future generations can be proud of.
            </p>
          </div>

          <Link
            href="/meet"
            className="shrink-0 btn-gold px-7 py-4 text-xs uppercase tracking-[0.2em] font-semibold"
          >
            Step Into the Work &rarr;
          </Link>
        </div>

      </div>
    </section>
  );
}
