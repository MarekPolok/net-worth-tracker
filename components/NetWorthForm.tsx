'use client';

import React, { useState } from 'react';

interface FormData {
    name: string;
    category: string;
    date: string;
    value: number;
    currency: string;
}

interface NetWorthFormProps {
    onSuccess?: () => void; // callback to refresh table after submit
}

export default function NetWorthForm({ onSuccess }: NetWorthFormProps) {
    const [form, setForm] = useState<FormData>({
        name: '',
        category: '',
        date: '',
        value: 0,
        currency: 'USD',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === 'value' ? Number(value) : value,
        }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/net-worth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const errorText = await res.text();
                setError(errorText || 'Failed to add entry');
                return; // stop execution
            }

            setForm({ name: '', category: '', date: '', value: 0, currency: 'USD' });
            if (onSuccess) onSuccess(); // refresh table
        } catch (err: any) {
            setError(err.message || 'Error submitting entry');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md bg-gray-50">
            {error && <p className="text-red-500">{error}</p>}

            <div className="flex flex-col">
                <label className="font-medium">Name</label>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="font-medium">Category</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                    required
                >
                    <option value="">Select category</option>
                    <option value="STOCKS">Stocks</option>
                    <option value="BONDS">Bonds</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="CASH">Cash</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="font-medium">Date</label>
                <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="font-medium">Value</label>
                <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                    required
                />
            </div>

            <div className="flex flex-col">
                <label className="font-medium">Currency</label>
                <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    className="border px-2 py-1 rounded"
                    required
                >
                    <option value="PLN">PLN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Add Entry'}
            </button>
        </form>
    );
}
