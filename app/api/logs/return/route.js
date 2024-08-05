import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  const { teamId, logIds } = await request.json();
  var res;
  var res2;
  try {
    res = await prisma.log.updateMany({
      where: {
        id: {
          in: logIds,
        },
      },
      data: {
        dateReturned: new Date(),
        isReturned: true,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update logs", details: error.message },
      { status: 500 }
    );
  }
  console.log(res);
  const tokensToReturn = res.count;
  if (tokensToReturn > 0) {
    res2 = await prisma.team.update({
      where: {
        id: teamId,
      },
      data: {
        tokensUsed: {
          decrement: tokensToReturn,
        },
      },
    });
    res2 = NextResponse.json({ res2 });
  } else {
    res2 = NextResponse.json(
      { error: "Cannot find matching records" },
      { status: 500 }
    );
  }

  return res2;
}
