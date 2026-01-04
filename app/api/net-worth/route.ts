import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET all entries
export async function GET() {
    const entries = await prisma.netWorthEntry.findMany({
        orderBy: { date: 'asc' },
    });
    return NextResponse.json(entries);
}

// POST a new entry
export async function POST(req: Request) {
    const data = await req.json();
    const newEntry = await prisma.netWorthEntry.create({ data });
    return NextResponse.json(newEntry);
}
