'use client';

import { useState } from 'react';
import NetWorthTable from '@/components/NetWorthTable';
import NetWorthForm from '@/components/NetWorthForm';
import AnalyticsDashboard from '@/components/AnalyticsDashboard'; // New Import
import Modal from '@/components/Modal';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<'table' | 'dashboard'>('dashboard');
    const [isOpen, setIsOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    function handleSuccess() {
        setIsOpen(false);
        setRefreshKey((k) => k + 1);
    }

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Wealth Tracker</h1>

                {activeTab === 'table' && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-shadow shadow-sm active:scale-95"
                    >
                        + Add Entry
                    </button>
                )}
            </div>

            {/* Tabs */}
            <nav className="flex space-x-8 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`pb-4 px-1 text-sm font-medium transition-all ${
                        activeTab === 'dashboard'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                    }`}
                >
                    Analytics Dashboard
                </button>
                <button
                    onClick={() => setActiveTab('table')}
                    className={`pb-4 px-1 text-sm font-medium transition-all ${
                        activeTab === 'table'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                    }`}
                >
                    Records Table
                </button>
            </nav>

            {/* Content Area */}
            <main>
                {activeTab === 'table' ? (
                    <NetWorthTable key={refreshKey} />
                ) : (
                    <AnalyticsDashboard />
                )}
            </main>

            {/* Modal */}
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