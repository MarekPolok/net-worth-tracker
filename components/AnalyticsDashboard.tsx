'use client';

import React from 'react';
// import { ResponsiveContainer, AreaChart, ... } from 'recharts';

export default function AnalyticsDashboard() {
    return (
        <div className="space-y-6">
            {/* Summary Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <p className="text-sm text-gray-500">Total Net Worth</p>
                    <p className="text-2xl font-bold text-green-600">$0.00</p>
                </div>
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <p className="text-sm text-gray-500">Assets</p>
                    <p className="text-2xl font-bold text-blue-600">$0.00</p>
                </div>
                <div className="p-6 bg-white rounded-xl border shadow-sm">
                    <p className="text-sm text-gray-500">Liabilities</p>
                    <p className="text-2xl font-bold text-red-600">$0.00</p>
                </div>
            </div>

            {/* Main Chart Section */}
            <div className="p-6 bg-white rounded-xl border shadow-sm min-h-100">
                <h3 className="text-lg font-semibold mb-4">Net Worth Over Time</h3>
                <div className="w-full h-80 flex items-center justify-center bg-gray-50 border-2 border-dashed rounded-lg text-gray-400">
                    Recharts LineChart will go here
                </div>
            </div>
        </div>
    );
}