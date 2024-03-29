import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await prisma.log.findMany({
    where: {
      isReturned: false,
      dateDue: {
        lte: new Date(),
      },
    },
    include: {
      team: true,
      teamMember: true,
      tool: true,
    },
    orderBy: {
      team: {
        teamNumber: "asc",
      },
    },
  });
  return NextResponse.json({ data });
}
