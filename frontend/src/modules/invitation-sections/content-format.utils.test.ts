import { describe, expect, it } from 'bun:test';
import {
  formatDateIndonesian,
  getMainWeddingDate,
  getCoupleDisplayNames,
} from './content-format.utils';

describe('Content Format Utils', () => {
  it('formats YYYY-MM-DD into Indonesian day, date, month, year', () => {
    // 2026-10-25 adalah Minggu
    const formatted = formatDateIndonesian('2026-10-25');
    expect(formatted).toBe('Minggu, 25 Oktober 2026');
  });

  it('handles empty date string safely', () => {
    expect(formatDateIndonesian('')).toBe('');
    expect(formatDateIndonesian(undefined)).toBe('');
  });

  it('gets main wedding date from first event', () => {
    const events = [
      {
        id: 'ev-1',
        eventName: 'Akad Nikah',
        date: '2026-11-15',
        timeRange: '08:00 - 10:00',
        venueName: 'Masjid Agung',
        venueAddress: 'Jl. Merdeka No. 1',
      },
    ];

    expect(getMainWeddingDate(events)).toBe('Minggu, 15 November 2026');
  });

  it('resolves couple nicknames prioritized over full names', () => {
    const couple = {
      groom: {
        fullName: 'Raden Rama Dananjaya, S.T.',
        nickname: 'Rama',
        parents: 'Bpk. Rama & Ibu Shinta',
      },
      bride: {
        fullName: 'Dewi Shinta Paramitha, S.Farm.',
        nickname: 'Shinta',
        parents: 'Bpk. Janaka & Ibu Kausalya',
      },
    };

    const names = getCoupleDisplayNames(couple);
    expect(names.groom).toBe('Rama');
    expect(names.bride).toBe('Shinta');
  });

  it('falls back to full name if nickname is empty', () => {
    const couple = {
      groom: {
        fullName: 'Budi Santoso',
        nickname: '',
        parents: '',
      },
      bride: {
        fullName: 'Siti Rahma',
        nickname: '',
        parents: '',
      },
    };

    const names = getCoupleDisplayNames(couple);
    expect(names.groom).toBe('Budi Santoso');
    expect(names.bride).toBe('Siti Rahma');
  });
});
