import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";

export async function POST(request) {
  const { log } = await request.json();
  const res = await prisma.log.create({
    data: {
      dateDue: log.dueDate,
      notes: log.notes,
      teamId: log.teamId,
      studentId: log.studentId,
      toolId: log.toolId,
    },
  });

  const res2 = await prisma.team.update({
    where: {
      id: log.teamId,
    },
    data: {
      tokensUsed: {
        increment: 1,
      },
    },
  });

  revalidateTag("logs");
  revalidateTag("logs_current");

  // console.log(res)
  return NextResponse.json({ res });
}
