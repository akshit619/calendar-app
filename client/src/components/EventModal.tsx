'use client';

import Modal from 'react-modal';
import { useEffect } from 'react';

Modal.setAppElement('#__next');

type EventModalProps = {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
};

export default function EventModal({ isOpen, onClose, date }: EventModalProps) {
    useEffect(() => {
        if (date) console.log("Selected date:", date);
    }, [date]);

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Event Modal"
            className="bg-white dark:bg-black p-6 max-w-md mx-auto mt-32 rounded-xl shadow-lg outline-none"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        >
            <h2 className="text-xl font-semibold mb-4">Events on {date?.toDateString()}</h2>
            <button onClick={onClose} className="text-sm text-blue-500 hover:underline">Close</button>
        </Modal>
    );
}