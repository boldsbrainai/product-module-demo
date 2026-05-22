import { kv } from "@vercel/kv";
import { NextRequest, NextResponse } from "next/server";
import { UserData } from "@/types";

function hasKvConfig() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function POST(request: NextRequest) {
  let payload: Partial<UserData> = {};

  try {
    payload = ((await request.json()) ?? {}) as Partial<UserData>;
  } catch {
    return NextResponse.json(null);
  }

  const { categoryId, categoryName } = payload;

  if (!categoryId || !categoryName) {
    return NextResponse.json(null);
  }

  const userData = {
    categoryId,
    categoryName,
  };

  const userId = request.cookies.get("userId")?.value!;
  if (!hasKvConfig()) {
    return new NextResponse();
  }

  await kv.set(userId, userData);

  return new NextResponse();
}

export async function DELETE(request: NextRequest) {
  const userData = {
    categoryId: null,
    categoryName: null,
  };

  const userId = request.cookies.get("userId")?.value!;
  if (!hasKvConfig()) {
    return new NextResponse();
  }

  await kv.set(userId, userData);

  return new NextResponse();
}
