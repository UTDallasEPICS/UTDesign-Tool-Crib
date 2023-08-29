import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET() {
    const data = await prisma.tool.findMany({
            where: {
                isActive: true
            },
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        }
        )

    return NextResponse.json({data})
}