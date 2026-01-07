'use client';

import { useState } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';

export default function NetWorthForm({ onSuccess }: { onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState<'ASSET' | 'LIABILITY'>('ASSET');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            type: type, // Using the state value
            category: formData.get('category'),
            value: parseFloat(formData.get('value') as string),
            currency: formData.get('currency'),
            date: date.toISOString(),
        };

        try {
            const res = await fetch('/api/net-worth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) onSuccess();
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            {/* 1. Type Toggle (Asset / Liability) */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <span className="font-medium text-gray-700">Type</span>
                <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => setType('ASSET')}
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                            type === 'ASSET'
                                ? 'bg-white shadow-sm text-green-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Asset
                    </button>
                    <button
                        type="button"
                        onClick={() => setType('LIABILITY')}
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                            type === 'LIABILITY'
                                ? 'bg-white shadow-sm text-red-600'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Liability
                    </button>
                </div>
            </div>

            {/* 2. Name Row */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="name" className="font-medium text-gray-700">Name</label>
                <input
                    id="name"
                    name="name"
                    placeholder={type === 'ASSET' ? "e.g. Savings Account" : "e.g. Credit Card"}
                    required
                    className="input w-full border p-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* 3. Category Row */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="category" className="font-medium text-gray-700">Category</label>
                <select
                    id="category"
                    name="category"
                    required
                    className="input w-full border p-2 rounded bg-white border-gray-300"
                >
                    {type === 'ASSET' ? (
                        <>
                            <option value="CASH">Cash</option>
                            <option value="STOCKS">Stocks</option>
                            <option value="BONDS">Bonds</option>
                            <option value="REAL_ESTATE">Real Estate</option>
                        </>
                    ) : (
                        <>
                            <option value="LOAN">Loan</option>
                            <option value="MORTGAGE">Mortgage</option>
                            <option value="OTHER">Other Debt</option>
                        </>
                    )}
                    <option value="OTHER">Other</option>
                </select>
            </div>

            {/* 4. Amount Row (Value + Currency) */}
            <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label htmlFor="value" className="font-medium text-gray-700">Amount</label>
                <div className="flex gap-4">
                    <input
                        id="value"
                        type="number"
                        step="0.01"
                        name="value"
                        placeholder="0.00"
                        required
                        className="input flex-1 border p-2 rounded border-gray-300"
                    />
                    <select
                        id="currency"
                        name="currency"
                        defaultValue="USD"
                        className="input w-32 border p-2 rounded bg-white font-semibold border-gray-300"
                    >
                        <option value="PLN">PLN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
            </div>

            {/* 5. Date Row */}
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
                    className={`px-6 py-2 text-white font-semibold rounded transition-all shadow-md active:scale-95 ${
                        type === 'ASSET' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                    } disabled:bg-gray-400`}
                >
                    {loading ? 'Saving...' : `Save ${type === 'ASSET' ? 'Asset' : 'Liability'}`}
                </button>
            </div>
        </form>
    );
}