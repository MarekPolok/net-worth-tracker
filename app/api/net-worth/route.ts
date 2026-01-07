import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all entries
export async function GET() {
    try {
        const entries = await prisma.netWorthEntry.findMany({
            orderBy: { date: 'asc' },
        });

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
    try {
        const body = await req.json();

        // Convert string to JS Date
        const date = new Date(body.date);

        if (isNaN(date.getTime())) {
            return NextResponse.json({ error: "Invalid date" }, { status: 400 });
        }

        // Basic validation for the new 'type' field
        if (!body.type || !['ASSET', 'LIABILITY'].includes(body.type)) {
            return NextResponse.json({ error: "Invalid entry type" }, { status: 400 });
        }

        const newEntry = await prisma.netWorthEntry.create({
            data: {
                name: body.name,
                type: body.type,       // Added this field
                category: body.category,
                date: date,
                value: body.value,
                currency: body.currency,
            },
        });

        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        console.error('POST /api/net-worth failed:', error);
        return NextResponse.json(
            { error: 'Failed to create entry' },
            { status: 500 }
        );
    }
}