import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request) {
  const { name } = await request.json();
  let res;
  const sameName = await prisma.tool.findMany({
    where: {
      name: name,
    },
  });
  if (sameName.length) {
    if (sameName[0].isActive) {
      return new Response("Tool already exists", {
        status: 409,
      });
    } else {
      res = await prisma.tool.update({
        where: {
          id: sameName[0].id,
        },
        data: {
          isActive: true,
        },
      });
    }
  } else {
    res = await prisma.tool.create({
      data: {
        name: name,
      },
    });
  }
  return NextResponse.json({ res });
}
