import { describe, expect, it } from 'bun:test';
import {
  createDefaultInvitationContent,
  mergeTemplateLayout,
  type SectionNodeData,
} from './invitation-content.helper';

describe('Invitation Content Helper', () => {
  it('creates default content with specified groom and bride nicknames', () => {
    const content = createDefaultInvitationContent('Pernikahan Rama & Shinta', 'Rama', 'Shinta');

    expect(content.couple.groom.nickname).toBe('Rama');
    expect(content.couple.bride.nickname).toBe('Shinta');
    expect(content.events).toHaveLength(2);
    expect(content.events[0].eventName).toBe('Akad Nikah');
    expect(content.events[1].eventName).toBe('Resepsi Pernikahan');
    expect(content.quote.sourceText).toBe('QS. Ar-Rum: 21');
  });

  it('merges new template layout preserving section visibility and copy overrides', () => {
    const existingSections: SectionNodeData[] = [
      {
        id: 'sec-hero-old',
        type: 'hero',
        variant: 'classic',
        isVisible: true,
        copy: { title: 'Custom Wedding Title' },
      },
      {
        id: 'sec-quote-old',
        type: 'quote',
        variant: 'sacred',
        isVisible: false,
        copy: { subtitle: 'Custom Sacred Subtitle' },
      },
    ];

    const newTemplateSections: SectionNodeData[] = [
      {
        id: 'sec-hero-new',
        type: 'hero',
        variant: 'editorial-split',
        isVisible: true,
        copy: { title: 'Default Template Title', badge: 'Save The Date' },
      },
      {
        id: 'sec-quote-new',
        type: 'quote',
        variant: 'minimal-center',
        isVisible: true,
        copy: { title: 'Ayat Suci' },
      },
      {
        id: 'sec-gallery-new',
        type: 'gallery',
        variant: 'masonry',
        isVisible: true,
        copy: { title: 'Momen Bahagia' },
      },
    ];

    const merged = mergeTemplateLayout(existingSections, newTemplateSections);

    expect(merged).toHaveLength(3);

    // Hero: adopted new variant 'editorial-split', preserved custom copy override 'Custom Wedding Title', took new badge
    const hero = merged.find((s) => s.type === 'hero');
    expect(hero?.variant).toBe('editorial-split');
    expect(hero?.copy?.title).toBe('Custom Wedding Title');
    expect(hero?.copy?.badge).toBe('Save The Date');

    // Quote: preserved isVisible: false from user's customization
    const quote = merged.find((s) => s.type === 'quote');
    expect(quote?.isVisible).toBe(false);
    expect(quote?.variant).toBe('minimal-center');
    expect(quote?.copy?.subtitle).toBe('Custom Sacred Subtitle');

    // Gallery: completely new section from template
    const gallery = merged.find((s) => s.type === 'gallery');
    expect(gallery?.variant).toBe('masonry');
    expect(gallery?.isVisible).toBe(true);
  });
});
