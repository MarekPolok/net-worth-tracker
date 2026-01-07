'use client';

import { useEffect, useState } from 'react';

// ADD THIS BLOCK:
interface Entry {
    id: number;
    name: string;
    type: 'ASSET' | 'LIABILITY';
    category: string;
    value: number;
    currency: string;
    date: string;
}

export default function NetWorthTable() {
    const [entries, setEntries] = useState<Entry[]>([]); // This uses the interface above
    const [filter, setFilter] = useState<'ALL' | 'ASSET' | 'LIABILITY'>('ALL');

    // ... rest of your component

    useEffect(() => {
        fetch('/api/net-worth')
            .then((res) => res.json())
            .then((data) => setEntries(data));
    }, []);

    // Logic to filter entries based on the selected type
    const filteredEntries = entries.filter(entry => {
        if (filter === 'ALL') return true;
        return entry.type === filter;
    });

    return (
        <div className="space-y-4">
            {/* Filter Controls */}
            <div className="flex items-center justify-between  p-3 rounded-lg border border-gray-200">
                <div className="flex gap-2">
                    {(['ALL', 'ASSET', 'LIABILITY'] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                filter === t
                                    ? 'bg-white shadow-sm text-blue-600 border border-gray-200'
                                    : 'text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {t.charAt(0) + t.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    Showing {filteredEntries.length} entries
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200  text-sm">
                    <thead>
                    <tr>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Type</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Category</th>
                        <th className="px-4 py-3 text-left font-semibold text-gray-500">Date</th>
                        <th className="px-4 py-3 text-right font-semibold text-gray-500">Value</th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200">
                    {filteredEntries.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50 transition-colors animate-in fade-in duration-300">
                            <td className="px-4 py-3 font-medium text-gray-500">{entry.name}</td>
                            <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        entry.type === 'ASSET' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {entry.type.charAt(0) + entry.type.slice(1).toLowerCase()}
                                    </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600">{entry.category}</td>
                            <td className="px-4 py-3 text-gray-600">
                                {/* Your formatDateEU logic here */}
                                {new Date(entry.date).toLocaleDateString('de-DE', {
                                    day: '2-digit', month: '2-digit', year: 'numeric'
                                })}
                            </td>
                            <td className={`px-4 py-3 text-right font-bold ${
                                entry.type === 'ASSET' ? 'text-green-600' : 'text-red-600'
                            }`}>
                                {entry.type === 'LIABILITY' ? '-' : ''}
                                {entry.value.toLocaleString(undefined, { minimumFractionDigits: 2 })} {entry.currency}
                            </td>
                        </tr>
                    ))}
                    {filteredEntries.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                                No records found for this category.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}