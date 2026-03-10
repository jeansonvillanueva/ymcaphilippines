import React from 'react';
import ActivityCalendar from "../components/ActivityCalendar";

const Calendar: React.FC = () => {
  return (
    <div className="container">
      <div className="card mt-4">
        <div className="card-body">
          <h2>Calendar of Activities</h2>
          <p>This is the calendar page of the website</p>

          <ActivityCalendar />
        </div>
      </div>
    </div>
  );
};

export default Calendar;