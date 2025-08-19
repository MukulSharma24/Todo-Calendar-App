import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { id, scheduledAt, duration } = await req.json();

    // Debug: log incoming id and types
    console.log("Trying to schedule todo with id:", id, "typeof id:", typeof id);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    if (!scheduledAt || isNaN(Date.parse(scheduledAt))) {
      return NextResponse.json({ error: "Invalid scheduledAt value" }, { status: 400 });
    }
    if (duration !== undefined && isNaN(Number(duration))) {
      return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
    }

    const todoExists = await prisma.todo.findUnique({ where: { id: Number(id) } });
    console.log("Found todo in DB?", !!todoExists, "DB id:", todoExists?.id);

    if (!todoExists) {
      return NextResponse.json({ error: "Todo not found for scheduling." }, { status: 404 });
    }

    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        scheduledAt: new Date(scheduledAt).toISOString(),
        duration: Number(duration),
        status: 'scheduled',
      },
    });

    return NextResponse.json(todo);
  } catch (error: any) {
    console.error('Schedule POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to schedule todo' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { id } = await req.json();

    // Debug: log incoming id and types
    console.log("Trying to unschedule todo with id:", id, "typeof id:", typeof id);

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const todoExists = await prisma.todo.findUnique({ where: { id: Number(id) } });
    console.log("Found todo in DB for unschedule?", !!todoExists, "DB id:", todoExists?.id);

    if (!todoExists) {
      return NextResponse.json({ error: "Todo not found for update." }, { status: 404 });
    }

    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: { scheduledAt: null, duration: null, status: 'pending' },
    });

    return NextResponse.json(todo);
  } catch (error: any) {
    console.error('Schedule PUT error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update todo' }, { status: 500 });
  }
}
