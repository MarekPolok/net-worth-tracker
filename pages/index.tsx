'use client';

import { useState } from 'react';
import NetWorthTable from '@/components/NetWorthTable';
import NetWorthForm from '@/components/NetWorthForm';
import Modal from '@/components/Modal';

export default function DashboardPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleSuccess() {
        setIsOpen(false);
        setRefreshKey((k) => k + 1);
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Net Worth</h1>

                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Add Entry
                </button>
            </div>

            <NetWorthTable key={refreshKey} />

            <Modal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                title="Add Net Worth Entry"
            >
                <NetWorthForm onSuccess={handleSuccess} />
            </Modal>
        </div>
    );
}
