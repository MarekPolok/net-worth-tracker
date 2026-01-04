'use client';

import { useState } from 'react';
import NetWorthForm from '@/components/NetWorthForm';
import NetWorthTable from '@/components/NetWorthTable';

export default function DashboardPage() {
    const [refresh, setRefresh] = useState(0);

    function handleRefresh() {
        // trigger table refresh
        setRefresh((prev) => prev + 1);
    }

    return (
        <div className="p-4 space-y-8">
            <h1 className="text-2xl font-bold">Net Worth Tracker</h1>

            <NetWorthForm onSuccess={handleRefresh} />

            {/* key={refresh} forces NetWorthTable to re-render */}
            <NetWorthTable key={refresh} />
        </div>
    );
}
