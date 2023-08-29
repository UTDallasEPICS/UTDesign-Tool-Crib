import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export async function GET() {
    const data = await prisma.log.findMany({
            where: {
                isReturned: false,
                dateDue:{
                    lte: new Date()
                }
            },
            include: {
                team: true,
                teamMember: true,
                tool: true
            }
        }
        )
    return NextResponse.json({data})
}