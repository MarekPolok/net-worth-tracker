'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// 1. Define the Interface (outside the component)
interface Entry {
    id: number;
    type: 'ASSET' | 'LIABILITY';
    category: string;
    value: number;
    currency: string;
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1'];

export default function AnalyticsDashboard() {
    const { resolvedTheme } = useTheme();
    const isDark = resolvedTheme === 'dark';

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

    // Logic: Calculate Summary Totals
    const totals = entries.reduce((acc, entry) => {
        if (entry.type === 'ASSET') acc.assets += entry.value;
        else acc.liabilities += entry.value;
        return acc;
    }, { assets: 0, liabilities: 0 });
    const netWorth = totals.assets - totals.liabilities;

    // 2. DEFINE allocationData HERE (Inside component, before return)
    const allocationData = entries
        .filter(e => e.type === 'ASSET')
        .reduce((acc: { name: string; value: number }[], entry) => {
            const existing = acc.find(item => item.name === entry.category);
            if (existing) {
                existing.value += entry.value;
            } else {
                acc.push({ name: entry.category, value: entry.value });
            }
            return acc;
        }, [])
        .sort((a, b) => b.value - a.value);

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="space-y-8">
            {/* --- SECTION 1: Summary Cards (The "Big Numbers") --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl border shadow-sm border-l-4 border-l-blue-500">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Net Worth</p>
                    <p className={`text-3xl font-bold mt-2 ${netWorth >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-400 uppercase">USD</span>
                    </p>
                </div>

                <div className="p-6 bg-white rounded-xl border shadow-sm border-l-4 border-l-green-500">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Assets</p>
                    <p className="text-3xl font-bold mt-2 text-green-600">
                        {totals.assets.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-400 uppercase">USD</span>
                    </p>
                </div>

                <div className="p-6 bg-white rounded-xl border shadow-sm border-l-4 border-l-red-500">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Liabilities</p>
                    <p className="text-3xl font-bold mt-2 text-red-600">
                        {totals.liabilities.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-gray-400 uppercase">USD</span>
                    </p>
                </div>
            </div>
            <div className="h-75 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* Now allocationData is in scope and valid! */}
                        <Pie data={allocationData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90}>
                            {allocationData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: isDark ? '#1f2937' : '#fff' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}