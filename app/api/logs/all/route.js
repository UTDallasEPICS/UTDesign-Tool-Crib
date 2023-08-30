import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await prisma.log.findMany({
    include: {
      team: true,
      teamMember: true,
      tool: true,
    },
  });
  return NextResponse.json({ data });
}
