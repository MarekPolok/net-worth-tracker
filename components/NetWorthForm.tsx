'use client';

import {useState} from 'react';
import {DatePicker} from '@progress/kendo-react-dateinputs';

interface NetWorthFormProps {
    onSuccess: () => void;
}

export default function NetWorthForm({onSuccess}: NetWorthFormProps) {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get('name'),
            category: formData.get('category'),
            date: date,
            value: Number(formData.get('value')),
            currency: formData.get('currency'),
        };

        await fetch('/api/net-worth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });

        setLoading(false);
        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* 1. Name Row */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="name" className="font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    name="name"
                    placeholder="e.g. Savings Account"
                    required
                    className="input w-full border p-2 rounded"
                />
            </div>

            {/* 2. Category Row */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="category" className="font-medium text-gray-700">Category</label>
                <select
                    id="category"
                    name="category"
                    required
                    className="input w-full border p-2 rounded bg-white"
                >
                    <option value="STOCKS">Stocks</option>
                    <option value="BONDS">Bonds</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="CASH">Cash</option>
                </select>
            </div>

            {/* 3. Amount Row (Value + Currency Dropdown) */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="value" className="font-medium text-gray-700">Amount</label>
                <div className="flex gap-4">
                    <input
                        id="value"
                        type="number"
                        step="0.01" // Allows for decimals in financial data
                        name="value"
                        placeholder="0.00"
                        required
                        className="input flex-1 border p-2 rounded"
                    />
                    <select
                        id="currency"
                        name="currency"
                        defaultValue="USD"
                        className="input w-32 border p-2 rounded bg-white font-semibold"
                    >
                        <option value="PLN">PLN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
            </div>

            {/* 4. Date Row */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="date" className="font-medium text-gray-700">Date</label>
                <div className="w-full">
                    <DatePicker
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.value!)}
                        format="dd.MM.yyyy"
                        style={{ width: '100%' }}
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
                >
                    {loading ? 'Saving...' : 'Save Record'}
                </button>
            </div>
        </form>
    );
}
