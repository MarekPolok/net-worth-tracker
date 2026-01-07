'use client';

import { useEffect, useState } from 'react';

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
    const [entries, setEntries] = useState<Entry[]>([]);

    useEffect(() => {
        fetch('/api/net-worth')
            .then((res) => res.json())
            .then((data) => setEntries(data));
    }, []);

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-900">Date</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-900">Value</th>
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-900">{entry.name}</td>

                        {/* Conditional Column for Type */}
                        <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    entry.type === 'ASSET'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {entry.type.charAt(0) + entry.type.slice(1).toLowerCase()}
                                </span>
                        </td>

                        <td className="px-4 py-3 text-gray-600">{entry.category}</td>
                        <td className="px-4 py-3 text-gray-600">
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
                </tbody>
            </table>
        </div>
    );
}