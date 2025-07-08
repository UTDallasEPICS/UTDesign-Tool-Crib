import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  const { update } = await request.json();
  //   console.log(update);
  const res = await prisma.log.update({
    where: {
      id: parseInt(update.id),
    },
    data: {
      strikeCount: update.strikeCount,
    },
  });
  return NextResponse.json(res);
}
