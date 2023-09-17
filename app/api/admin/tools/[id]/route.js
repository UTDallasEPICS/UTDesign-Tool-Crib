import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  const id = params.id;
  const res = await prisma.tool.update({
    where: {
      id: parseInt(id),
    },
    data: {
      isActive: false,
    },
  });
  revalidateTag("tools");
  return NextResponse.json({ res });
}
