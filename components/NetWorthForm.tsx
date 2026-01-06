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
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="bg-red-500 p-4 text-white">Hello Tailwind</div>

            <div className="flex flex-col">
                <label htmlFor="name" className="mb-10 font-medium">
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    placeholder="Name"
                    required
                    className="input w-40"
                />
            </div>

            {/* Category */}
            <div className="flex flex-col">
                <label htmlFor="category" className="mb-1 font-medium">
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    required
                    className="input w-40"
                >
                    <option value="STOCKS">Stocks</option>
                    <option value="BONDS">Bonds</option>
                    <option value="REAL_ESTATE">Real Estate</option>
                    <option value="CASH">Cash</option>
                </select>
            </div>

            {/* Date */}
            <div className="flex flex-col">
                <label htmlFor="date" className="mb-1 font-medium">
                    Date
                </label>
                <div style={{ width: '150px', display: 'inline-block'}}>
                    <DatePicker
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.value!)}
                        format="dd.MM.yyyy"
                        style={{ width: '100%' }} // fills wrapper
                    />
                </div>
            </div>

            {/* Value */}
            <div className="flex flex-col">
                <label htmlFor="value" className="mb-1 font-medium">
                    Value
                </label>
                <input
                    id="value"
                    type="number"
                    name="value"
                    required
                    className="input w-32"
                />
            </div>

            {/* Currency */}
            <div className="flex flex-col">
                <label htmlFor="currency" className="mb-1 font-medium">
                    Currency
                </label>
                <input
                    id="currency"
                    name="currency"
                    defaultValue="USD"
                    className="input w-32"
                />
            </div>

            <div className="flex justify-end gap-2">
                <button type="submit" disabled={loading} className="btn-primary">
                    {loading ? 'Saving...' : 'Save'}
                </button>
            </div>
        </form>
    );
}
