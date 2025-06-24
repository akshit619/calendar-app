'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-calendar/dist/Calendar.css';
import 'react-toastify/dist/ReactToastify.css';



export default function CalendarClient() {
    const [date, setDate] = useState<Date | Date[]>(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [eventTitle, setEventTitle] = useState('');
    const [events, setEvents] = useState<Record<string, string>>({});

    useEffect(() => {
        Modal.setAppElement('#root');
    }, []);

    const handleDateChange = (selectedDate: Date | Date[]) => {
        setDate(selectedDate);
        setEventTitle(events[getDateKey(selectedDate)] || '');
        setIsModalOpen(true);
    };

    const getDateKey = (date: Date | Date[]) => {
        const d = Array.isArray(date) ? date[0] : date;
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const handleSave = () => {
        const key = getDateKey(date);
        setEvents(prev => ({ ...prev, [key]: eventTitle }));
        toast.success('Event saved!');
        setIsModalOpen(false);
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

        <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            className="bg-white p-6 rounded shadow-lg w-80 mx-auto mt-40"
            overlayClassName="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start"
        >
            <h2 className="text-lg font-semibold mb-2">Add Event</h2>
            <input
            type="text"
            placeholder="Event title"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
            <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
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