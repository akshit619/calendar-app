import dynamic from 'next/dynamic';
import CalendarWrapper from "@/components/CalendarWrapper";


export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100 text-gray-900">
      <h1 className="text-2xl font-bold mb-4">Event Calendar</h1>
      <CalendarWrapper />
    </main>
  );
}