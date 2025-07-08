import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request, props) {
  const params = await props.params;
  const id = params.id;
  console.log(id);
  const res = await prisma.team.update({
    where: {
      id: parseInt(id),
    },
    data: {
      strikeCount: { increment: 1 },
    },
  });
  return NextResponse.json(res);
}
