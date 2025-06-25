'use client';


import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import { getEvents, createEvent } from '@/services/api';



export default function CalendarClient() {
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [events, setEvents] = useState<Record<string, any[]>>({});
    const [time, setTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');


    const fetchEvents = async () => {
        try {
            const res = await getEvents();
            const mappedEvents: Record<string, any[]> = {};
            res.data.forEach((event: any) => {
                const dateOnly = event.datetime.split('T')[0];
                if (!mappedEvents[dateOnly]) mappedEvents[dateOnly] = [];
                mappedEvents[dateOnly].push(event);
            });
            setEvents(mappedEvents);
        } catch (error) {
            toast.error('Failed to load events');
        }
    };


    useEffect(() => {
        Modal.setAppElement('#root');
        fetchEvents();
    }, []);

    const handleDateChange = (selectedDate: Date | Date[]) => {
        setDate(selectedDate);
        setEventTitle('');
        setIsModalOpen(true);
    };

    const getDateKey = (date: Date | Date[]) => {
        const d = Array.isArray(date) ? date[0] : date;
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const handleSave = async () => {
        const key = getDateKey(date);
        // setEvents(prev => ({ ...prev, [key]: eventTitle }));
        // toast.success('Event saved!');
        // setIsModalOpen(false);
        try{
            const res = await createEvent({
                title: eventTitle,
                datetime: `${key}T${time || '00:00'}:00`,
                description: '',
                imageUrl,
                videoUrl,
            });
            toast.success('Event saved!');
            setIsModalOpen(false);
            fetchEvents();
        }catch(error){
            toast.error('Failed to save event');
        }
    };

    return (
        <div className="flex flex-col items-center">
        <Calendar
            onChange={handleDateChange}
            value={date}
            className="rounded-lg shadow-lg p-4"
        />
        <p className="mt-4 text-sm">
            Selected date:{' '}
            {Array.isArray(date) ? date[0].toDateString() : date.toDateString()}
        </p>

        {/* {events[getDateKey(date)]?.length > 0 && (
            <div className="mb-4 text-sm text-black">
                <p className="font-medium">Saved events:</p>
                <ul className="list-disc list-inside">
                {events[getDateKey(date)].map((event, idx) => (
                    <li key={idx}>{event.title}</li>
                ))}
                </ul>
            </div>
        )} */}

        {events[getDateKey(date)]?.length > 0 && (
            <div className="mb-4 text-sm text-black">
                <p className="font-medium mb-1">Saved events:</p>
                <ul className="list-disc list-inside space-y-1">
                {events[getDateKey(date)].map((event, idx) => {
                    const time = new Date(event.datetime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    });

                    return (
                    <li key={event.id}>
                        <span className="font-semibold">{time}</span> — {event.title}
                    </li>
                    );
                })}
                </ul>
            </div>
        )}

        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="bg-white p-6 rounded shadow-lg w-80 mx-auto mt-40"
            overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start"
        >
            <h2 className="text-lg font-semibold mb-2 text-black">Add Event</h2>
            <input
            type="text"
            placeholder="Event title"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4 text-black"
            />
            <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full mb-2 text-black"
                placeholder="Time"
            />
            <input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full mb-2 text-black"
            />
            <input
                type="text"
                placeholder="Video URL"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full mb-4 text-black"
            />
            <div className="flex justify-end space-x-2">
            <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
            Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            Save
            </button>
            </div>
        </Modal>

        <ToastContainer position="bottom-right" />
        </div>
    );
}