import prisma from "@/app/lib/prisma";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

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
  console.log(team.removeMembers);
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

  revalidateTag("teams");

  return NextResponse.json({
    newTeam: teamRes,
    membersAdded: newStudentRes,
    membersRemoved: studentRemoveRes,
  });
}

export async function POST(request) {
  const { team } = await request.json();
  // console.log(team);
  const teamExists = await prisma.team.findFirst({
    where: { teamNumber: team.teamNumber },
    include: { teamMembers: { select: { id: true } } },
  });
  // console.log(teamExists);
  let teamRes;
  if (teamExists) {
    let teamMembers = [];
    team.teamMembers.forEach((student) => {
      teamMembers.push({
        name: student,
        teamId: teamExists.id,
      });
    });
    const studentRes = await prisma.student.createMany({
      data: teamMembers,
    });
    // console.log(teamExists.teamMembers);
    teamRes = await prisma.team.update({
      where: {
        id: teamExists.id,
      },
      data: {
        isActive: true,
        tableNumber: team.tableNumber,
        teamMembers: {
          disconnect: teamExists.teamMembers,
        },
      },
    });

    // console.log(teamRes);
    // console.log(teamExists);
    // console.log(teamExists.teamMembers);
    const removeIds = teamExists.teamMembers.map((e) => e.id);
    // console.log(removeIds);
    // Remove Current students
    // const studentRemoveRes = await prisma.student.updateMany({
    //   where: {
    //     id: {
    //       in: removeIds,
    //     },
    //   },
    //   data: {
    //     teamId: { set: null },
    //   },
    // });
  } else {
    teamRes = await prisma.team.create({
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
  }
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

  revalidateTag("teams");

  return NextResponse.json({ res });
}
