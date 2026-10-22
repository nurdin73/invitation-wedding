export interface AudioPreset {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export const AUDIO_PRESETS: AudioPreset[] = [
  {
    id: 'canon-in-d',
    title: 'Canon in D (Piano & Cello)',
    artist: 'Johann Pachelbel (Instrumental)',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=romantic-wedding-piano-10651.mp3',
  },
  {
    id: 'romantic-acoustic',
    title: 'Sweet Acoustic Romance',
    artist: 'Acoustic Guitar & Piano',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-acoustic-guitar-112191.mp3',
  },
  {
    id: 'cinematic-love',
    title: 'A Thousand Moments of Love',
    artist: 'Cinematic Orchestral Strings',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_7c59573887.mp3?filename=wedding-love-1393.mp3',
  },
];
