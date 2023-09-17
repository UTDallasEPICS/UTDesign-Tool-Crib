import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const data = await prisma.team.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      teamNumber: "asc",
    },
    include: {
      teamMembers: true,
    },
  });

  // console.log(data)
  return NextResponse.json({ data });
}
