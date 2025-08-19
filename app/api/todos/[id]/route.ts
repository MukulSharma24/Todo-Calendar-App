import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const data = await req.json();

  
  if (data.scheduledAt && isNaN(Date.parse(data.scheduledAt))) {
    return NextResponse.json({ error: "Invalid scheduledAt value" }, { status: 400 });
  }

  
  if (data.duration !== undefined && isNaN(Number(data.duration))) {
    return NextResponse.json({ error: "Invalid duration" }, { status: 400 });
  }

  
  const todoExists = await prisma.todo.findUnique({ where: { id } });
  if (!todoExists) {
    return NextResponse.json({ error: "Todo not found for update." }, { status: 404 });
  }

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data,
    });
    return NextResponse.json(todo);
  } catch (error) {
    return NextResponse.json(
      { error: "Todo not found or update failed" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.todo.delete({ where: { id } });
    return NextResponse.json({ message: "Todo deleted" });
  } catch (error) {
    return NextResponse.json(
      { error: "Todo not found or delete failed" },
      { status: 400 }
    );
  }
}
