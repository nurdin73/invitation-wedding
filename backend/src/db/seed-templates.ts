import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../configs/env';
import { templates } from './schema/templates.schema';
import { eq } from 'drizzle-orm';

const client = postgres(env.DATABASE_URL, { max: 1 });
const db = drizzle(client);

const STARTER_TEMPLATES = [
  {
    slug: 'classic-dusty-rose',
    name: 'Classic Dusty Rose',
    category: 'Floral & Romantic',
    description: 'Desain romantis bertema floral klasik dengan palet dusty rose dan aksen emas. Dilengkapi galeri 2-kolom grid yang anggun.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    themeConfig: {
      paletteId: 'dusty-rose',
      primaryColor: '#B86B70',
      secondaryColor: '#DFB15B',
      canvasBackground: '#FAF8F5',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
    },
    sampleContent: {
      couple: {
        groom: {
          fullName: 'Rama Dananjaya, S.T.',
          nickname: 'Rama',
          parents: 'Putra pertama dari Bpk. Bambang Dananjaya & Ibu Endang Sriwahyuni',
          instagram: 'ramadananjaya',
          photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        },
        bride: {
          fullName: 'Shinta Paramitha, S.Farm.',
          nickname: 'Shinta',
          parents: 'Putri kedua dari Bpk. Raden Soepomo & Ibu Ratna Wulandari',
          instagram: 'shintaparamitha',
          photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        },
      },
      events: [
        {
          id: 'ev-1',
          eventName: 'Akad Nikah',
          date: '2026-10-28',
          timeRange: '08:00 - 10:00 WIB',
          venueName: 'Masjid Agung Sunda Kelapa',
          venueAddress: 'Jl. Taman Sunda Kelapa No.16, Menteng, Jakarta Pusat',
          mapsUrl: 'https://maps.google.com',
        },
        {
          id: 'ev-2',
          eventName: 'Resepsi Pernikahan',
          date: '2026-10-28',
          timeRange: '11:00 - 14:00 WIB',
          venueName: 'Grand Ballroom Hotel Indonesia Kempinski',
          venueAddress: 'Jl. M.H. Thamrin No.1, Menteng, Jakarta Pusat',
          mapsUrl: 'https://maps.google.com',
        },
      ],
      quote: {
        quoteText: 'Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
        sourceText: 'QS. Ar-Rum: 21',
      },
      story: [],
      gallery: [
        { id: 'img-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', caption: 'Pre-wedding session' },
        { id: 'img-2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', caption: 'Romantic Golden Hour' },
        { id: 'img-3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80', caption: 'The Engagement Day' },
        { id: 'img-4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', caption: 'Our Little Moments' },
      ],
      gift: {
        accounts: [
          { id: 'acc-1', bankName: 'BCA', accountNumber: '8830192831', accountHolder: 'Rama Dananjaya' },
          { id: 'acc-2', bankName: 'Mandiri', accountNumber: '1370019283741', accountHolder: 'Shinta Paramitha' },
        ],
        giftAddress: 'Jl. Cempaka Putih Timur No. 42, Jakarta Pusat 10510',
        recipientName: 'Rama & Shinta',
        recipientPhone: '081234567890',
      },
      music: {
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-wedding-113645.mp3',
        isAutoplay: false,
      },
    },
    sections: [
      {
        id: 'sec-hero-dusty',
        type: 'hero',
        variant: 'classic',
        isVisible: true,
        copy: {
          subtitle: 'The Wedding Celebration',
          welcomeNote: 'Dengan penuh rasa syukur dan sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu pada pernikahan kami.',
        },
      },
      {
        id: 'sec-quote-dusty',
        type: 'quote',
        variant: 'sacred',
        isVisible: true,
        copy: {
          title: 'Kutipan Suci',
        },
      },
      {
        id: 'sec-couple-dusty',
        type: 'couple',
        variant: 'side-by-side',
        isVisible: true,
        copy: {
          title: 'Mempelai Pengantin',
          subtitle: 'Maha Suci Allah yang telah menciptakan makhluk-Nya berpasang-pasangan, kami bermaksud melangsungkan pernikahan putra-putri kami:',
        },
      },
      {
        id: 'sec-event-dusty',
        type: 'event',
        variant: 'cards',
        isVisible: true,
        copy: {
          title: 'Agenda Acara',
          subtitle: 'Rangkaian perayaan dan ikrar suci pernikahan kami',
        },
      },
      {
        id: 'sec-gallery-dusty',
        type: 'gallery',
        variant: 'grid',
        isVisible: true,
        copy: {
          title: 'Momen Bahagia',
          subtitle: 'Potret kenangan terindah dalam perjalanan cinta kami',
        },
      },
      {
        id: 'sec-rsvp-dusty',
        type: 'rsvp',
        variant: 'interactive',
        isVisible: true,
        copy: {
          title: 'Konfirmasi Kehadiran & Doa Restu',
          subtitle: 'Kehadiran dan doa restu Anda merupakan kehormatan yang teramat berharga bagi kami.',
          showAttendanceCount: true,
        },
      },
      {
        id: 'sec-gift-dusty',
        type: 'gift',
        variant: 'bank-cards',
        isVisible: true,
        copy: {
          title: 'Tanda Kasih (Wedding Gift)',
          subtitle: 'Doa restu Anda merupakan karunia terindah bagi kami. Namun jika berkenan memberikan tanda kasih secara digital, dapat melalui rekening berikut:',
        },
      },
      {
        id: 'sec-footer-dusty',
        type: 'footer',
        variant: 'closing',
        isVisible: true,
        copy: {
          closingText: 'Terima Kasih',
          thankYouNote: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu kepada kami.',
        },
      },
    ],
  },
  {
    slug: 'botanical-sage',
    name: 'Botanical Sage',
    category: 'Botanical & Rustic',
    description: 'Nuansa segar dedaunan eucalyptus dan sage green dengan tipografi modern. Dilengkapi galeri carousel interaktif dan linimasa kisah cinta.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    themeConfig: {
      paletteId: 'sage-green',
      primaryColor: '#58755E',
      secondaryColor: '#BFA054',
      canvasBackground: '#F4F7F4',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
    },
    sampleContent: {
      couple: {
        groom: {
          fullName: 'Bagas Prasetyo, M.Eng.',
          nickname: 'Bagas',
          parents: 'Putra sulung dari Bpk. Ir. H. Prasetyo & Ibu Dra. Hj. Sri Wahyuni',
          instagram: 'bagasprasetyo',
          photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        },
        bride: {
          fullName: 'Nadia Larasati, S.Ds.',
          nickname: 'Nadia',
          parents: 'Putri tercinta dari Bpk. Hendra Gunawan & Ibu Maya Anggraeni',
          instagram: 'nadialarasati',
          photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        },
      },
      events: [
        {
          id: 'ev-sage-1',
          eventName: 'Akad Nikah',
          date: '2026-11-14',
          timeRange: '09:00 - 11:00 WIB',
          venueName: 'Masjid Bani Umar',
          venueAddress: 'Jl. Graha Bintaro Raya Kav. GK 4, Parigi Baru, Tangerang Selatan',
          mapsUrl: 'https://maps.google.com',
        },
        {
          id: 'ev-sage-2',
          eventName: 'Resepsi Garden Party',
          date: '2026-11-14',
          timeRange: '15:30 - 19:30 WIB',
          venueName: 'Plataran Dharmawangsa',
          venueAddress: 'Jl. Dharmawangsa Raya No.6, Kebayoran Baru, Jakarta Selatan',
          mapsUrl: 'https://maps.google.com',
        },
      ],
      quote: {
        quoteText: 'Cinta sejati bukanlah tentang mencari seseorang yang sempurna, melainkan belajar melihat orang yang tidak sempurna dengan cara yang sempurna.',
        sourceText: 'Kutipan Puitis',
      },
      story: [
        { id: 'st-1', year: '2019', title: 'Pertama Bertemu', story: 'Pertemuan perdana yang tak disengaja di sebuah pameran seni rupa kontemporer.' },
        { id: 'st-2', year: '2022', title: 'Mulai Menjalin Komitmen', story: 'Menemukan visi dan mimpi yang sama untuk masa depan bersama.' },
        { id: 'st-3', year: '2025', title: 'Lamaran Sakral', story: 'Ikrar restu di hadapan kedua keluarga besar tercinta.' },
      ],
      gallery: [
        { id: 'img-s1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', caption: 'The First Spark' },
        { id: 'img-s2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', caption: 'Under The Pines' },
        { id: 'img-s3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80', caption: 'Sunset Promise' },
        { id: 'img-s4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', caption: 'Whispers of Tomorrow' },
      ],
      gift: {
        accounts: [
          { id: 'acc-s1', bankName: 'BCA', accountNumber: '7720918231', accountHolder: 'Bagas Prasetyo' },
          { id: 'acc-s2', bankName: 'BSI', accountNumber: '7182938192', accountHolder: 'Nadia Larasati' },
        ],
        giftAddress: 'Jl. Bintaro Utama Sektor 9 No. 18, Tangerang Selatan 15229',
        recipientName: 'Bagas & Nadia',
        recipientPhone: '081398765432',
      },
      music: {
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=wedding-acoustic-123456.mp3',
        isAutoplay: false,
      },
    },
    sections: [
      {
        id: 'sec-hero-sage',
        type: 'hero',
        variant: 'classic',
        isVisible: true,
        copy: {
          subtitle: 'A Botanical Garden Wedding',
          welcomeNote: 'Bersama dedaunan asri dan semilir angin, kami menyambut Anda merayakan janji suci kami.',
        },
      },
      {
        id: 'sec-quote-sage',
        type: 'quote',
        variant: 'sacred',
        isVisible: true,
        copy: {
          title: 'Harmoni Kasih',
        },
      },
      {
        id: 'sec-couple-sage',
        type: 'couple',
        variant: 'side-by-side',
        isVisible: true,
        copy: {
          title: 'Dua Jiwa Bersatu',
          subtitle: 'Menapaki lembaran baru kehidupan dengan restu dan doa orang tua tercinta:',
        },
      },
      {
        id: 'sec-story-sage',
        type: 'story',
        variant: 'timeline',
        isVisible: true,
        copy: {
          title: 'Jejak Langkah Kami',
          subtitle: 'Setiap lembaran cerita membawa kami menuju hari bahagia ini',
        },
      },
      {
        id: 'sec-event-sage',
        type: 'event',
        variant: 'cards',
        isVisible: true,
        copy: {
          title: 'Waktu & Lokasi Bahagia',
          subtitle: 'Rangkaian momen sakral pengikatan janji suci kami',
        },
      },
      {
        id: 'sec-gallery-sage',
        type: 'gallery',
        variant: 'slider',
        isVisible: true,
        copy: {
          title: 'Galeri Potret Kenangan',
          subtitle: 'Geser untuk menatap kembali senyum dan kehangatan kebersamaan kami',
        },
      },
      {
        id: 'sec-rsvp-sage',
        type: 'rsvp',
        variant: 'interactive',
        isVisible: true,
        copy: {
          title: 'Konfirmasi Kehadiran Tamu',
          subtitle: 'Bantu kami mempersiapkan jamuan terbaik dengan konfirmasi kehadiran Anda',
          showAttendanceCount: true,
        },
      },
      {
        id: 'sec-gift-sage',
        type: 'gift',
        variant: 'bank-cards',
        isVisible: true,
        copy: {
          title: 'Amplop & Tanda Kasih Digital',
          subtitle: 'Kehadiran Anda adalah hadiah terbesar. Bagi yang berhalangan hadir dan berkenan memberi tanda kasih:',
        },
      },
      {
        id: 'sec-footer-sage',
        type: 'footer',
        variant: 'closing',
        isVisible: true,
        copy: {
          closingText: 'Sampai Jumpa di Hari Bahagia',
          thankYouNote: 'Salam hangat dan rasa terima kasih sedalam-dalamnya dari kami sekeluarga besar.',
        },
      },
    ],
  },
  {
    slug: 'midnight-luxury',
    name: 'Midnight Luxury',
    category: 'Modern & Editorial',
    description: 'Kemewahan palet midnight dark espresso dengan aksen emas champange. Menonjolkan estetika editorial kartu bertingkat yang glamor.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=600&q=80',
    themeConfig: {
      paletteId: 'midnight-gold',
      primaryColor: '#DFB15B',
      secondaryColor: '#B86B70',
      canvasBackground: '#1C1715',
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Plus Jakarta Sans, sans-serif',
    },
    sampleContent: {
      couple: {
        groom: {
          fullName: 'Alexander Danu Wijaya, B.Bus.',
          nickname: 'Alexander',
          parents: 'Putra dari Bpk. Hendry Danu Wijaya & Ibu Christine Wijaya',
          instagram: 'alexanderdanu',
          photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
        },
        bride: {
          fullName: 'Clara Evelyn Hartanto, B.A.',
          nickname: 'Clara',
          parents: 'Putri dari Bpk. Robert Hartanto & Ibu Stephanie Hartanto',
          instagram: 'claraevelyn',
          photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
        },
      },
      events: [
        {
          id: 'ev-mid-1',
          eventName: 'Holy Matrimony',
          date: '2026-12-05',
          timeRange: '10:00 - 12:00 WIB',
          venueName: 'Gereja Katedral Jakarta',
          venueAddress: 'Jl. Katedral No.7B, Pasar Baru, Jakarta Pusat',
          mapsUrl: 'https://maps.google.com',
        },
        {
          id: 'ev-mid-2',
          eventName: 'Grand Wedding Reception',
          date: '2026-12-05',
          timeRange: '18:30 - 22:00 WIB',
          venueName: 'The Ritz-Carlton Jakarta, Pacific Place',
          venueAddress: 'SCBD, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan',
          mapsUrl: 'https://maps.google.com',
        },
      ],
      quote: {
        quoteText: 'I have found the one whom my soul loves. In a sea of people, my eyes will always search for you.',
        sourceText: 'Song of Solomon 3:4',
      },
      story: [],
      gallery: [
        { id: 'img-m1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', caption: 'Editorial Grandeur' },
        { id: 'img-m2', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', caption: 'Black Tie Elegance' },
        { id: 'img-m3', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80', caption: 'The Midnight Vow' },
        { id: 'img-m4', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', caption: 'Forever Entwined' },
      ],
      gift: {
        accounts: [
          { id: 'acc-m1', bankName: 'BCA Prioritas', accountNumber: '0019283741', accountHolder: 'Alexander Danu Wijaya' },
          { id: 'acc-m2', bankName: 'Citibank / Jago', accountNumber: '109283746192', accountHolder: 'Clara Evelyn Hartanto' },
        ],
        giftAddress: 'Apartemen Senopati Suites Tower 2 Unit 18A, Kebayoran Baru, Jakarta Selatan',
        recipientName: 'Alexander & Clara',
        recipientPhone: '081198761234',
      },
      music: {
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=cinematic-piano-wedding-9876.mp3',
        isAutoplay: false,
      },
    },
    sections: [
      {
        id: 'sec-hero-mid',
        type: 'hero',
        variant: 'classic',
        isVisible: true,
        copy: {
          subtitle: 'The Grand Matrimony & Gala Reception',
          welcomeNote: 'We cordially invite you to celebrate the holy matrimony and evening reception of our lives.',
        },
      },
      {
        id: 'sec-quote-mid',
        type: 'quote',
        variant: 'sacred',
        isVisible: true,
        copy: {
          title: 'Sacred Word',
        },
      },
      {
        id: 'sec-couple-mid',
        type: 'couple',
        variant: 'side-by-side',
        isVisible: true,
        copy: {
          title: 'The Bride & The Groom',
          subtitle: 'With the blessings of God Almighty and our beloved families:',
        },
      },
      {
        id: 'sec-event-mid',
        type: 'event',
        variant: 'cards',
        isVisible: true,
        copy: {
          title: 'Celebration Itinerary',
          subtitle: 'The timeline of our wedding moments',
        },
      },
      {
        id: 'sec-gallery-mid',
        type: 'gallery',
        variant: 'cards',
        isVisible: true,
        copy: {
          title: 'Editorial Visuals',
          subtitle: 'Cherished memories captured through the lens',
        },
      },
      {
        id: 'sec-rsvp-mid',
        type: 'rsvp',
        variant: 'interactive',
        isVisible: true,
        copy: {
          title: 'RSVP & Guest Confirmation',
          subtitle: 'Kindly confirm your attendance to ensure seated arrangement for the evening gala.',
          showAttendanceCount: true,
        },
      },
      {
        id: 'sec-gift-mid',
        type: 'gift',
        variant: 'bank-cards',
        isVisible: true,
        copy: {
          title: 'Wedding Registry & Blessing',
          subtitle: 'Your gracious presence and prayers are our greatest blessings. Should you wish to honor us with a gift:',
        },
      },
      {
        id: 'sec-footer-mid',
        type: 'footer',
        variant: 'closing',
        isVisible: true,
        copy: {
          closingText: 'With Sincere Appreciation',
          thankYouNote: 'We look forward to celebrating this sacred union together with you.',
        },
      },
    ],
  },
];

async function seed() {
  console.log('🚀 Memulai seeding 3 Starter Templates dengan arsitektur data-first...');

  for (const tpl of STARTER_TEMPLATES) {
    const existing = await db
      .select({ id: templates.id })
      .from(templates)
      .where(eq(templates.slug, tpl.slug))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(templates)
        .set({
          name: tpl.name,
          category: tpl.category,
          description: tpl.description,
          thumbnailUrl: tpl.thumbnailUrl,
          themeConfig: tpl.themeConfig,
          sampleContent: tpl.sampleContent,
          sections: tpl.sections,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(templates.slug, tpl.slug));
      console.log(`  🔄 Template diperbarui: [${tpl.slug}] ${tpl.name}`);
    } else {
      await db.insert(templates).values({
        slug: tpl.slug,
        name: tpl.name,
        category: tpl.category,
        description: tpl.description,
        thumbnailUrl: tpl.thumbnailUrl,
        themeConfig: tpl.themeConfig,
        sampleContent: tpl.sampleContent,
        sections: tpl.sections,
        isActive: true,
      });
      console.log(`  ✨ Template baru dibuat: [${tpl.slug}] ${tpl.name}`);
    }
  }

  console.log('✅ Seeding 3 Starter Templates selesai dengan sukses!');
  await client.end();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error('❌ Gagal menjalankan seeding templates:', err);
  await client.end();
  process.exit(1);
});
