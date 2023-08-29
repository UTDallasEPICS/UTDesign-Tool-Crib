import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const data = await prisma.team.updateMany({
            data: {
                isActive: false
            }
        }
        )
    return NextResponse.json({data})
}