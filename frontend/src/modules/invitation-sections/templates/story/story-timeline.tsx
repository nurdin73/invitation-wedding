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
      className="relative w-full py-16 px-6 text-center space-y-6 flex flex-col justify-center items-center min-h-[60vh]"
      style={{
        backgroundColor: 'var(--inv-bg, #FAF8F5)',
        color: 'var(--inv-font-body, #3A302C)',
      }}
    >
      <div className="space-y-1">
        <h2
          className="text-2xl font-normal"
          style={{
            fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)',
            color: 'var(--inv-primary, #B86B70)',
          }}
        >
          {copy?.title || 'Kisah Cinta Kami (Love Story)'}
        </h2>
        <p className="text-xs opacity-70 max-w-sm mx-auto">
          {copy?.subtitle || 'Perjalanan indah hingga kami berlabuh di pelaminan'}
        </p>
      </div>

      <div className="max-w-sm mx-auto pt-4 relative text-left w-full">
        {/* Central Vertical Timeline Guide */}
        <div className="absolute top-4 bottom-4 left-4 w-0.5 bg-current/15 -translate-x-1/2" />

        <div className="space-y-6 pl-8">
          {stories.map((item: StoryTimelineItem, index: number) => (
            <div key={item.id || index} className="relative group">
              {/* Bullet Node on Timeline */}
              <div
                className="absolute -left-8 top-1 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center text-white shadow-xs"
                style={{ backgroundColor: 'var(--inv-primary, #B86B70)' }}
              >
                <Heart className="w-2.5 h-2.5 fill-current" />
              </div>

              {/* Story Content Card */}
              <div className="p-4 rounded-xl border border-current/10 bg-current/[0.02] space-y-1.5 transition-all group-hover:border-[var(--inv-primary)]/40">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold tracking-wider text-[var(--inv-primary)] font-mono uppercase">
                    {item.year}
                  </span>
                  <Sparkles className="w-3 h-3 text-[var(--inv-primary)] opacity-60" />
                </div>
                <h3
                  className="font-semibold text-sm text-foreground"
                  style={{ fontFamily: 'var(--inv-font-heading, "Playfair Display", serif)' }}
                >
                  {item.title}
                </h3>
                <p className="text-xs opacity-75 leading-relaxed">
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
