import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function ActivityCalendar() {
  const events = [ // format 'year-mt-dy'
    { title: "NAO Meeting", date: "2026-03-03" },
    { title: "World YMCA Constitutional Reform", date: "2026-03-05" },
    { title: "International Women's Day", date: "2026-03-05" },
    { title: "Finance Meeting", date: "2026-03-06" },
    { title: "NGS Meeting", date: "2026-03-06" },
    { title: "Meeting with Ms. Ramos", date: "2026-03-07" },
    { title: "TWG Meeting with Y-USA", date: "2026-03-12" },
    { title: "Joint Legal and Property Metting", date: "2026-03-12" },
    { title: "Mr. Santos BDay", date: "2026-03-12" },
    { title: "NB Meeting with Y-USA", date: "2026-03-13" },
    { title: "Regular MB Meeting", date: "2026-03-13" },
    { title: "National Academic Olymic", date: "2026-03-14" },
    { title: "National Academic Olymic", date: "2026-03-15" },
    { title: "National Academic Olymic", date: "2026-03-15" },
    { title: "Engr. Ken BDay", date: "2026-03-15" },
    { title: "THE FEAST", date: "2026-03-21" },
    { title: "THE FEAST", date: "2026-03-28" }
  ];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
      />
    </div>
  );
}

export default ActivityCalendar;