'use client';

import { useEffect, useState } from 'react';

interface Entry {
    id: number;
    type: 'ASSET' | 'LIABILITY';
    value: number;
    currency: string;
}

export default function AnalyticsDashboard() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/net-worth')
            .then((res) => res.json())
            .then((data) => {
                setEntries(data);
                setLoading(false);
            });
    }, []);

    // Calculate totals
    // Note: For multi-currency, this sums values as-is.
    // In a future step, you might want to add exchange rate conversion.
    const totals = entries.reduce((acc, entry) => {
        if (entry.type === 'ASSET') {
            acc.assets += entry.value;
        } else {
            acc.liabilities += entry.value;
        }
        return acc;
    }, { assets: 0, liabilities: 0 });

    const netWorth = totals.assets - totals.liabilities;

    if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Net Worth Card */}
                <div className="p-6 bg-white rounded-xl border shadow-sm border-l-4 border-l-blue-500">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Net Worth</p>
                    <p className={`text-3xl font-bold mt-2 ${netWorth >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-gray-400">USD</span>
                    </p>
                </div>

                {/* Assets Card */}
                <div className="p-6 bg-white rounded-xl border shadow-sm border-l-4 border-l-green-500">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Assets</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">
                        + {totals.assets.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-gray-400">USD</span>
                    </p>
                </div>

                {/* Liabilities Card */}
                <div className="p-6 bg-white rounded-xl border shadow-sm border-l-4 border-l-red-500">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Liabilities</p>
                    <p className="text-3xl font-bold mt-2 text-red-600">
                        - {totals.liabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-gray-400">USD</span>
                    </p>
                </div>
            </div>

            {/* Placeholder for Charts */}
            <div className="p-8 bg-white rounded-xl border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Asset Allocation</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-lg">
                    <p className="text-gray-400 text-sm">Next Step: Recharts Pie Chart for Categories</p>
                </div>
            </div>
        </div>
    );
}