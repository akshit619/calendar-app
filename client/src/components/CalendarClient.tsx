'use client';

import { useState, useEffect, useRef } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';
import { getEvents, createEvent, updateEvent, deleteEvent } from '@/services/api';


export default function CalendarClient() {
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [events, setEvents] = useState<Record<string, any[]>>({});
    const [time, setTime] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const requestNotificationPermission = () => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                toast.success('Notifications enabled!');
            } else {
                toast.error('Notifications denied.');
            }
            });
        }
    };



    const fetchEvents = async () => {
        try {
            const res = await getEvents();
            const mappedEvents: Record<string, any[]> = {};
            res.data.forEach((event: any) => {
                const dateOnly = new Date(event.datetime).toLocaleDateString('sv-SE');
                if (!mappedEvents[dateOnly]) mappedEvents[dateOnly] = [];
                mappedEvents[dateOnly].push(event);
            });
            setEvents(mappedEvents);
        } catch (error) {
            toast.error('Failed to load events');
        }
    };

    const showNotification = (event: any) => {
        if (Notification.permission !== 'granted') return;

        const notification = new Notification(`🔔 Event: ${event.title}`, {
            body: 'Click to snooze for 1 minutes.',
            requireInteraction: true,
        });

        notification.onclick = () => {
            notification.close();
            // Snooze for 1 minutes
            setTimeout(() => {
            showNotification(event);
            }, 1 * 60 * 1000);
        };
    };


    useEffect(() => {
        Modal.setAppElement('#root');
        fetchEvents();
    }, []);

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const notifiedIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        Object.values(events).flat().forEach(event => {
            if (notifiedIds.current.has(event.id)) return;

            const eventTime = new Date(event.datetime).getTime();
            const now = Date.now();
            const curr = new Date().toISOString();
            

            if (eventTime > now) {
                const delay = eventTime - now;
                if (delay <= 0) {
                    console.log(`Skipping "${event.title}" – already in the past.`);
                    return;
                }
                console.log(`!!! Scheduling notification for "${event.title}" at`, new Date(eventTime).toLocaleString());

                console.log(`Delay is ${delay / 1000}s`);

                setTimeout(() => {
                    showNotification(event);
                    notifiedIds.current.delete(event.id); // optionally remove after showing
                }, delay);

                notifiedIds.current.add(event.id);
            }
        });
    }, [events]);


    const handleDateChange = (selectedDate: Date | Date[]) => {
        setDate(selectedDate);
        setEventTitle('');
        setIsModalOpen(true);
        requestNotificationPermission();
    };

    const getDateKey = (date: Date | Date[]) => {
        const d = Array.isArray(date) ? date[0] : date;
        return d.toLocaleDateString('sv-SE'); // YYYY-MM-DD
    };

    const handleSave = async () => {
        const key = getDateKey(date);
        const localDateTime = new Date(`${key}T${time}:00`);
        const datetime = localDateTime.toISOString();

        const payload = {
            title: eventTitle,
            datetime,
            description: '',
            imageUrl,
            videoUrl,
        };

        try {
            if (selectedEventId) {
            await updateEvent(selectedEventId, payload);
            toast.success('Event updated!');
            } else {
            await createEvent(payload);
            toast.success('Event created!');
            }

            setIsModalOpen(false);
            setSelectedEventId(null);
            fetchEvents();
        } catch {
            toast.error('Failed to save event');
        }
    };

    const eventsForDate = events[getDateKey(date)] || [];

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

        
        {eventsForDate.length > 0 ? (
            <div className="mb-4 text-sm text-black">
                <p className="font-medium mb-1">Saved events:</p>
                <ul className="list-disc list-inside space-y-1">
                {eventsForDate
                .slice()
                .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime())
                .map((event) => {
                    const time = new Date(event.datetime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    });

                    return (
                    <li key={event.id} className="flex justify-between items-center">
                        <span
                            className="cursor-pointer hover:text-blue-500"
                            onClick={() => {
                                setDate(new Date(event.datetime));
                                setSelectedEventId(event.id);
                                setEventTitle(event.title);
                                setTime(new Date(event.datetime).toTimeString().slice(0, 5));
                                setImageUrl(event.imageUrl || '');
                                setVideoUrl(event.videoUrl || '');
                                setIsModalOpen(true);
                            }}
                        >
                        <span className="font-semibold">{time}</span> — {event.title}
                        </span>

                        <button
                        onClick={async () => {
                            try {
                                await deleteEvent(event.id);
                                toast.success('Event deleted!');
                                fetchEvents();
                            } catch {
                                toast.error('Failed to delete event');
                            }
                        }}
                        className="ml-2 text-red-500 text-xs hover:underline"
                        >
                        Delete
                        </button>
                    </li>
                    );
                })}
                </ul>
            </div>
        ) : (
            <p className="text-sm text-gray-500 italic mb-4">No events scheduled for this date.</p>
        )}

        <button
            onClick={() => {
                new Notification("🔔 Test Reminder", {
                body: "This is how your event reminder will look!",
                });
            }}
            className="px-3 py-1 text-sm bg-indigo-500 text-white rounded hover:bg-indigo-600"
            >
            Trigger Test Notification
        </button>

        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="bg-white p-6 rounded shadow-lg w-80 mx-auto mt-40"
            overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start"
        >
            <h2 className="text-lg font-semibold mb-2 text-black">{selectedEventId ? 'Edit Event' : 'Add Event'}</h2>
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
                onClick={() => {
                    setIsModalOpen(false);
                    setSelectedEventId(null);
                    setEventTitle('');
                    setTime('');
                    setImageUrl('');
                    setVideoUrl('');
                }}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 text-black"
            >
            Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            >
            {selectedEventId ? 'Update' : 'Save'}
            </button>
            </div>
        </Modal>

        <ToastContainer position="bottom-right" />
        </div>
    );
}