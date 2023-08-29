import prisma from "@/app/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const data = await prisma.team.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                teamNumber: 'asc'
            },
            include: {
                teamMembers: true
            }
        }
        )
    return NextResponse.json({data})
}

export async function POST(request) {
    const {team} = await request.json()
    console.log(team)
    const teamRes = await prisma.team.create({
        data: {
            teamNumber: team.teamNumber,
            tableNumber: team.tableNumber,
            tokens: team.tokens
        }
    })
    console.log(teamRes)
    let teamMembers = []
    team.teamMembers.forEach(student => {
        teamMembers.push({
            name: student,
            teamId: teamRes.id
        })
    })
    const studentRes = await prisma.student.createMany({
        data: teamMembers
    })
    console.log(studentRes)
    // const studentRes = await prisma.student.
    return NextResponse.json({team})
}

export async function DELETE(request) {
    const { id } = await request.json()
    const res = await prisma.team.update({
        where: {
            id: id
        },
        data: {
            isActive: false
        }

    })
    
    // const studentRes = await prisma.student.
    return NextResponse.json({res})
}