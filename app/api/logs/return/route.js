import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  const { teamId, logIds } = await request.json();
  var res1, res2, theResponse;
  try {
    [res1, res2] = await prisma.$transaction([
      prisma.log.updateMany({
        where: {
          id: {
            in: logIds,
          },
        },
        data: {
          dateReturned: new Date(),
          isReturned: true,
        },
      }),
      prisma.team.update({
        where: {
          id: teamId,
        },
        data: {
          tokensUsed: {
            decrement: logIds.length,
          },
        },
      }),
    ]);
    theResponse = NextResponse.json({ res1, res2 });
  } catch (error) {
    theResponse = NextResponse.json(
      { error: "Failed to process transaction", details: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(theResponse);
}
