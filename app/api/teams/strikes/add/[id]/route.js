import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request, props) {
  const params = await props.params;
  const id = params.id;
  console.log(id);
  let strikeTime = new Date();
  strikeTime = new Date(strikeTime.setHours(0, 0, 0, 0)).toISOString();
  const res = await prisma.team.update({
    where: {
      id: parseInt(id),
    },
    data: {
      strikeCount: { increment: 1 },
      strikeTime: strikeTime,
    },
  });
  return NextResponse.json(res);
}
