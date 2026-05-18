import type { EventInput } from '@fullcalendar/core';
import engrKehImg from '../assets/images/events/Engr_Keh-BDay.jpg';

export type CalendarEventRecord = {
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  image?: string;
};

/** Plain records for search + FullCalendar `events` mapping */
export const CALENDAR_EVENT_RECORDS: CalendarEventRecord[] = [
  { title: 'NAO Meeting', date: '2026-03-03', description: 'Basta Meeting to' },
  { title: 'World YMCA Constitutional Reform', date: '2026-03-05', description: 'Basta Meeting to' },
  { title: "International Women's Day", date: '2026-03-05', description: 'Basta Meeting to' },
  {
    title: 'Engr. Ken BDay',
    date: '2026-03-15',
    description:
      'Happy Birthday to our National President, Engr. Antonio C. Keh! Your leadership continues to inspire and strengthen the YMCA family.',
    image: engrKehImg,
  },
  { title: 'THE FEAST', date: '2026-03-21',
    description: 'The Feast to be held on March 21, 2026 at 2:00 PM to 9:00 PM. Details to follow.',
   },
  { title: 'THE FEAST', date: '2026-03-28',
    description: 'The Feast to be held on March 28, 2026 at 2:00 PM to 9:00 PM. Details to follow.',
   },
  { title: 'World Council Information Webinar', date: '2026-03-26',
    description: 'World Council Information Webinar to be held on March 26, 2026 at 9:00 PM to 10:30 PM. Details to follow.',
   },
];

export const FULLCALENDAR_EVENTS: EventInput[] = CALENDAR_EVENT_RECORDS.map((e) => ({
  title: e.title,
  date: e.date,
  extendedProps: { description: e.description, image: e.image },
}));
