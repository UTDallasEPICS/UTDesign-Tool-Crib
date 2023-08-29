import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"
export async function DELETE(request, {params}) {
    const id = params.id
    const res = await prisma.tool.update({
        where: {
            id: parseInt(id)
        },
        data: {
            isActive: false
        }
    })
    return NextResponse.json({res})
}