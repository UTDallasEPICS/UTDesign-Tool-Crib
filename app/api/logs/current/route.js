import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET() {
  const data = await prisma.log.findMany({
    where: {
      isReturned: false,
    },
    include: {
      team: true,
      teamMember: true,
      tool: true,
    },
    orderBy: { dateDue: "asc" },
  });
  // console.log({data})
  // console.log(data[0])
  return NextResponse.json({ data });
}
