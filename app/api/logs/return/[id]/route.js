import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request, {params}) {
    console.log(params)
    const id = params.id
    const res = await prisma.log.update({
        where: {
            id: parseInt(id)
        },
        data: {
            dateReturned: new Date(),
            isReturned: true
        }
    })
    return NextResponse.json({res})
}