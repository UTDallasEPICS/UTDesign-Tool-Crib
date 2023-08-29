import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

// export async function GET() {
//     const data = await prisma.tool.findMany({
//             where: {
//                 isActive: true
//             },
//             select: {
//                 id: true,
//                 name: true
//             },
//             orderBy: {
//                 name: 'asc'
//             }
//         }
//         )

//     return NextResponse.json({data})
// }

export async function POST(request) {
    const {name} = await request.json()
    let res
    const sameName = await prisma.tool.findMany({
        where: {
            name: name
        }
    })
    if (sameName.length) {
        if (sameName[0].isActive) {
            return new Response("Tool already exists", {
                status: 409
            })
        } else {
            res = await prisma.tool.update({
                where: {
                    id: sameName[0].id
                },
                data: {
                    exists: true
                }
            })
        }
    } else {
        res = await prisma.tool.create({
            data: {
                name: name
            }
        })
    }
    return NextResponse.json({res})
}
