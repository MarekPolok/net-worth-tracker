import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all entries
export async function GET() {
    try {
        const entries = await prisma.netWorthEntry.findMany({
            orderBy: { date: 'asc' },
        });

        // ALWAYS return valid JSON
        return NextResponse.json(entries);
    } catch (error) {
        console.error('GET /api/net-worth failed:', error);

        return NextResponse.json(
            { error: 'Failed to fetch net worth entries' },
            { status: 500 }
        );
    }
}

// POST a new entry
export async function POST(req: Request) {
    const body = await req.json();

    // Convert string to JS Date
    const date = new Date(body.date);

    if (isNaN(date.getTime())) {
        return new Response(JSON.stringify({ error: "Invalid date" }), { status: 400 });
    }

    const newEntry = await prisma.netWorthEntry.create({
        data: {
            name: body.name,
            category: body.category,
            date: date, // <- must be a Date object
            value: body.value,
            currency: body.currency,
        },
    });

    return new Response(JSON.stringify(newEntry), { status: 201 });
}

