import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import type { EventInput } from '@fullcalendar/core';

export type CalendarEvent = {
  title: string;
  date: string;
  description?: string;
  image?: string;
};

type Props = {
  onEventClick?: (event: CalendarEvent) => void;
  events?: Array<{ title: string; date: string; description?: string; imageUrl?: string }>;
};

function ymdToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function ActivityCalendar({ onEventClick, events }: Props) {
  const todayStr = ymdToday();

  // Convert API events to FullCalendar format - always use API events (no fallback to static)
  const calendarEvents: EventInput[] = (events || []).map((e) => ({
    title: e.title,
    date: e.date,
    extendedProps: { description: e.description, image: e.imageUrl },
  }));

  const handleEventClick = (arg: EventClickArg) => {
    onEventClick?.({
      title: arg.event.title,
      date: (arg.event.startStr || '').slice(0, 10),
      description: arg.event.extendedProps.description,
      image: arg.event.extendedProps.image,
    });
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={calendarEvents}
      eventClick={handleEventClick}
      height="auto"
      dayCellClassNames={(arg) => {
        const y = arg.date.getFullYear();
        const m = String(arg.date.getMonth() + 1).padStart(2, '0');
        const d = String(arg.date.getDate()).padStart(2, '0');
        const cell = `${y}-${m}-${d}`;
        return cell === todayStr ? ['ymca-calendar-today-ring'] : [];
      }}
    />
  );
}

export default ActivityCalendar;
