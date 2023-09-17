import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.team.updateMany({
    data: {
      isActive: false,
    },
  });
  revalidateTag("teams");
  return NextResponse.json({ data });
}
