import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request) {
    const data = await prisma.user.findMany({
            where: {
                isActive: true,
                isAdmin: true
            },
        }
        )
    // console.log(data)
    return NextResponse.json({data})
}