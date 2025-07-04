import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request, props) {
  const params = await props.params;
  const id = params.id;
  const res = await prisma.log.update({
    where: {
      id: parseInt(id),
    },
    data: {
      dateReturned: new Date(),
      isReturned: true,
    },
  });
  const res2 = await prisma.team.update({
    where: {
      id: res.teamId,
    },
    data: {
      tokensUsed: {
        decrement: 1,
      },
    },
  });
  return NextResponse.json({ res, res2 });
}
