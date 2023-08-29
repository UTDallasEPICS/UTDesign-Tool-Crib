import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export const dynamic = 'force-dynamic'
export const revalidate = 0

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