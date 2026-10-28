'use client';

import * as React from 'react';
import type { SectionRenderProps, StoryTimelineItem } from '../../types';
import { Heart, Sparkles } from 'lucide-react';

export const StoryTimeline: React.FC<SectionRenderProps<'story'>> = ({
  content,
  copy,
  isEditor,
}) => {
  const stories = (content?.story && content.story.length > 0)
    ? content.story
    : (isEditor
        ? [
            {
              id: 'sample-story-1',
              year: '2022',
              title: 'Pertemuan Pertama',
              story: 'Awal mula kisah cinta dan komitmen kami bermula.',
            },
          ]
        : []);

  return (
    <section
      data-testid="section-story-timeline"
      className="relative w-full py-12 sm:py-20 md:py-24 px-4 sm:px-6 text-center space-y-6 sm:space-y-8 flex flex-col justify-center items-center min-h-[100dvh] min-h-screen"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="space-y-2 max-w-sm sm:max-w-xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl md:text-4xl font-normal tracking-tight"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {copy?.title || 'Kisah Cinta Kami (Love Story)'}
        </h2>
        <p className="text-xs sm:text-sm opacity-75 max-w-xs sm:max-w-md mx-auto leading-relaxed">
          {copy?.subtitle || 'Perjalanan indah hingga kami berlabuh di pelaminan'}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--inv-primary)]/40 to-transparent mx-auto pt-2" />
      </div>

      <div className="max-w-sm sm:max-w-xl md:max-w-2xl mx-auto pt-4 sm:pt-6 relative text-left w-full">
        {/* Central Vertical Timeline Guide */}
        <div className="absolute top-6 bottom-6 left-5 sm:left-6 w-0.5 bg-gradient-to-b from-transparent via-[var(--inv-primary)]/30 to-transparent -translate-x-1/2" />

        <div className="space-y-4 sm:space-y-8 pl-10 sm:pl-12">
          {stories.map((item: StoryTimelineItem, index: number) => (
            <div key={item.id || index} className="relative group">
              {/* Bullet Node on Timeline */}
              <div
                className="absolute -left-10 sm:-left-12 top-2 -translate-x-1/2 w-6 sm:w-7 h-6 sm:h-7 rounded-full border-2 border-background flex items-center justify-center text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
              >
                <Heart className="w-3 h-3 fill-current" />
              </div>

              {/* Story Content Card */}
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-[var(--inv-primary)]/20 bg-white/70 dark:bg-black/30 backdrop-blur-md space-y-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)] hover:border-[var(--inv-primary)]/40 transition-all duration-300">
                <div className="flex items-center justify-between border-b border-current/10 pb-2">
                  <span className="text-xs sm:text-sm font-bold tracking-[0.2em] text-[var(--inv-primary)] font-mono uppercase">
                    {item.year}
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--inv-primary)] opacity-70" />
                </div>
                <h3
                  className="font-medium text-base sm:text-lg text-foreground tracking-tight"
                  style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed">
                  {item.story}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
