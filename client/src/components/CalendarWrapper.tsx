'use client';

import dynamic from "next/dynamic";

// Dynamically import your client-only component
const CalendarClient = dynamic(() => import("./CalendarClient"), {
  ssr: false,
});

export default function CalendarWrapper() {
  return <CalendarClient />;
}