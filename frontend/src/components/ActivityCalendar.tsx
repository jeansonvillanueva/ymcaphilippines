import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventClickArg } from '@fullcalendar/core';
import type { EventInput } from '@fullcalendar/core';

export type CalendarEvent = {
  title: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  start?: string;
  end?: string;
  description?: string;
  image?: string;
  imageUrl?: string;
};

type Props = {
  onEventClick?: (event: CalendarEvent) => void;
  events?: Array<CalendarEvent | { title: string; date?: string; startDate?: string; endDate?: string; start?: string; end?: string; description?: string; imageUrl?: string; image?: string }>;
};

function ymdToday() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// Helper function to add 1 day to a date string (YYYY-MM-DD)
// This avoids timezone issues by working with local dates
function addOneDay(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  // Create a local date (not UTC) and add 1 day
  const d = new Date(year, month - 1, day + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dayStr = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dayStr}`;
}

function ActivityCalendar({ onEventClick, events }: Props) {
  const todayStr = ymdToday();

  // Convert API events to FullCalendar format
  // Supports both old single-date format and new date-range format
  const calendarEvents: EventInput[] = (events || []).map((e) => {
    // For date range events (new format)
    if (e.startDate && e.endDate) {
      return {
        title: e.title,
        start: e.startDate,
        end: addOneDay(e.endDate), // Add 1 day for inclusive end (FullCalendar expects exclusive end)
        extendedProps: { 
          description: e.description, 
          image: e.imageUrl || e.image,
          startDate: e.startDate,
          endDate: e.endDate,
          originalDate: e.startDate
        },
      };
    }
    // For single-date events (old format or backward compatibility)
    if (e.date) {
      return {
        title: e.title,
        date: e.date,
        extendedProps: { 
          description: e.description, 
          image: e.imageUrl || e.image,
          originalDate: e.date
        },
      };
    }
    // Fallback for any other format
    return {
      title: e.title,
      date: e.start || e.startDate || new Date().toISOString().split('T')[0],
      extendedProps: {
        description: e.description,
        image: e.imageUrl || e.image,
      },
    };
  });

  const handleEventClick = (arg: EventClickArg) => {
    const startDate = arg.event.extendedProps.startDate;
    const endDate = arg.event.extendedProps.endDate;
    const originalDate = arg.event.extendedProps.originalDate || (arg.event.startStr || '').slice(0, 10);
    
    onEventClick?.({
      title: arg.event.title,
      date: originalDate,
      startDate: startDate,
      endDate: endDate,
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
