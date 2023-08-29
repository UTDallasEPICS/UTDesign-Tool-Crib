import { NextResponse } from "next/server"
import prisma from "@/app/lib/prisma"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
    const data = await prisma.user.findMany({
            where: {
                isActive: true
            }
        }
        )
    return NextResponse.json({data})
}

export async function POST(request) {
    const {user} = await request.json()
    const sameEmail = await prisma.user.findMany({
        where: {
            email: user.email
        }
    })
    var res
    if (sameEmail.length) {
        if (sameEmail[0].isActive) {
            return new Response("User already exists", {
                status: 409
            })
        } else {
            res = await prisma.user.update({
                where: {id: sameEmail[0].id},
                data: {
                    isActive: true,
                    isAdmin: user.isAdmin
                }
            })
        }
    } else {
        res = await prisma.user.create({
            data: {
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    }

    return NextResponse.json({res})
}