'use client';

import { useEffect, useState } from 'react';

export interface NetWorthEntry {
    id: number;
    name: string;
    category: string;
    date: string;
    value: number;
    currency: string;
}

export default function NetWorthTable() {
    const [entries, setEntries] = useState<NetWorthEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch entries from API
    useEffect(() => {
        async function fetchEntries() {
            try {
                const res = await fetch('/api/net-worth');
                const data: NetWorthEntry[] = await res.json();
                setEntries(data);
            } catch (err) {
                console.error('Failed to fetch entries:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchEntries();
    }, []);

    if (loading) return <p>Loading net worth entries...</p>;
    if (!entries.length) return <p>No entries yet.</p>;

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Value</th>
                    <th className="px-4 py-2 border">Currency</th>
                </tr>
                </thead>
                <tbody>
                {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{entry.id}</td>
                        <td className="px-4 py-2 border">{entry.name}</td>
                        <td className="px-4 py-2 border">{entry.category}</td>
                        <td className="px-4 py-2 border">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="px-4 py-2 border">{entry.value.toLocaleString()}</td>
                        <td className="px-4 py-2 border">{entry.currency}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}