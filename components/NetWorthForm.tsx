'use client';

import { useState } from 'react';

interface NetWorthFormProps {
    onSuccess: () => void;
}

export default function NetWorthForm({ onSuccess }: NetWorthFormProps) {
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);

        const payload = {
            name: formData.get('name'),
            category: formData.get('category'),
            date: formData.get('date'),
            value: Number(formData.get('value')),
            currency: formData.get('currency'),
        };

        await fetch('/api/net-worth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setLoading(false);
        onSuccess();
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" placeholder="Name" required className="input" />
            <select name="category" required className="input">
                <option value="STOCKS">Stocks</option>
                <option value="BONDS">Bonds</option>
                <option value="REAL_ESTATE">Real Estate</option>
                <option value="CASH">Cash</option>
            </select>
            <input type="date" name="date" required className="input" />
            <input type="number" name="value" required className="input" />
            <input name="currency" defaultValue="USD" className="input" />

            <div className="flex justify-end gap-2">
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
