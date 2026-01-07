'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, LabelList
} from 'recharts';

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

    const totalCount = entries.filter(e => e.type === 'ASSET').length;

    const countData = entries
        .filter(e => e.type === 'ASSET')
        .reduce((acc: any[], entry) => {
            const existing = acc.find(item => item.name === entry.category);
            if (existing) {
                existing.count += 1;
            } else {
                acc.push({ name: entry.category, count: 1 });
            }
            return acc;
        }, [])
        .map(item => ({
            ...item,
            // Calculate percentage for each category
            percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0
        }))
        .sort((a, b) => b.count - a.count);

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* PIE CHART: Value Distribution */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4 tracking-widest transition-colors">
                        Asset Allocation (Value)
                    </h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={allocationData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    innerRadius={60} outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {allocationData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#111827' : '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                    }}
                                    itemStyle={{
                                        color: isDark ? '#f9fafb' : '#111827'
                                    }}
                                    // Adds commas and currency suffix
                                    formatter={(value: number) =>
                                        `${value.toLocaleString(undefined, { minimumFractionDigits: 2 })} USD`
                                    }
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BAR CHART: Item Frequency */}
                <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-widest">
                        Entry Count by Category
                    </h3>
                    <div className="h-75 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={countData}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 12 }}
                                />
                                <YAxis hide />
                                <Tooltip
                                    cursor={{ fill: isDark ? '#1f2937' : '#f3f4f6' }}
                                    contentStyle={{
                                        backgroundColor: isDark ? '#111827' : '#fff',
                                        border: 'none',
                                        borderRadius: '8px',
                                    }}
                                    itemStyle={{
                                        color: isDark ? '#f9fafb' : '#111827'
                                    }}
                                    // Customize tooltip to show count and percentage
                                    formatter={(value: number, name: string, props: any) => {
                                        if (name === 'count') {
                                            return [`${props.payload.percentage}%`];
                                        }
                                        return [value, name];
                                    }}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {countData.map((_, index) => (
                                        <Cell key={`cell-bar-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                    {/* Optional: Show percentage text on top of the bars */}
                                    <LabelList
                                        dataKey="percentage"
                                        position="top"
                                        formatter={(val: string) => `${val}%`}
                                        style={{ fill: isDark ? '#9ca3af' : '#4b5563', fontSize: 11 }}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}