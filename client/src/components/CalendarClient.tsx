'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarClient() {
  const [date, setDate] = useState<Date | Date[]>(new Date());

  return (
    <div className="flex flex-col items-center">
      <Calendar
        onChange={setDate}
        value={date}
        className="rounded-lg shadow-lg p-4"
      />
      <p className="mt-4 text-sm">
        Selected date:{' '}
        {Array.isArray(date) ? date[0].toDateString() : date.toDateString()}
      </p>
    </div>
  );
}