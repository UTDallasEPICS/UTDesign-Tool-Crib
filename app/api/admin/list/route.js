import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const data = await prisma.user.findMany({
    where: {
      isActive: true,
      isAdmin: true,
    },
  });
  return NextResponse.json({ data });
}
