import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {
    const data = await prisma.log.findMany({
        include: {
            team: true,
            teamMember: true,
            tool: true
        }
    })
    return NextResponse.json({data})
}