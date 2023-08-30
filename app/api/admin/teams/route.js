import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await prisma.team.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      teamNumber: "asc",
    },
    include: {
      teamMembers: true,
    },
  });
  return NextResponse.json({ data });
}

export async function PATCH(request) {
  const { team } = await request.json();

  const studentRemoveRes = await prisma.student.updateMany({
    where: {
      id: {
        in: team.removeMembers,
      },
    },
    data: {
      teamId: null,
    },
  });
  let newMembers = [];
  team.newMembers.forEach((student) => {
    newMembers.push({
      name: student,
      teamId: team.teamId,
    });
  });
  const newStudentRes = await prisma.student.createMany({
    data: newMembers,
  });
  // console.log(newStudentRes)
  const teamRes = await prisma.team.update({
    where: {
      id: team.teamId,
    },
    data: {
      tableNumber: team.tableNumber,
      tokens: team.tokens,
    },
  });

  return NextResponse.json({
    newTeam: teamRes,
    membersAdded: newStudentRes,
    membersRemoved: studentRemoveRes,
  });
}

export async function POST(request) {
  const { team } = await request.json();
  const teamRes = await prisma.team.create({
    data: {
      teamNumber: team.teamNumber,
      tableNumber: team.tableNumber,
      tokens: team.tokens,
    },
  });
  let teamMembers = [];
  team.teamMembers.forEach((student) => {
    teamMembers.push({
      name: student,
      teamId: teamRes.id,
    });
  });
  const studentRes = await prisma.student.createMany({
    data: teamMembers,
  });
  return NextResponse.json({ team });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const res = await prisma.team.update({
    where: {
      id: id,
    },
    data: {
      isActive: false,
    },
  });

  return NextResponse.json({ res });
}
