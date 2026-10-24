import type { EventItem, InvitationContent } from './types';

const MONTH_NAMES_ID = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const DAY_NAMES_ID = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export function formatDateIndonesian(dateString?: string): string {
  if (!dateString) return '';

  // If already formatted in indonesian text or custom string
  if (dateString.includes(' ') && !dateString.includes('-')) {
    return dateString;
  }

  const [yearStr, monthStr, dayStr] = dateString.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(monthIndex) || isNaN(day) || monthIndex < 0 || monthIndex > 11) {
    return dateString;
  }

  const dateObj = new Date(year, monthIndex, day);
  const dayName = DAY_NAMES_ID[dateObj.getDay()] || '';
  const monthName = MONTH_NAMES_ID[monthIndex] || '';

  return `${dayName}, ${day} ${monthName} ${year}`;
}

export function getMainWeddingDate(events?: EventItem[]): string {
  if (!events || events.length === 0) return '';
  const firstEvent = events[0];
  return formatDateIndonesian(firstEvent.date);
}

export function getMainWeddingISODate(events?: EventItem[]): string {
  if (!events || events.length === 0) return '';
  return events[0].date || '';
}

export function getCoupleDisplayNames(couple?: InvitationContent['couple']): {
  groom: string;
  bride: string;
} {
  const groom = couple?.groom?.nickname || couple?.groom?.fullName || '';
  const bride = couple?.bride?.nickname || couple?.bride?.fullName || '';
  return { groom, bride };
}
