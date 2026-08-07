import { NextRequest, NextResponse } from "next/server";
import { searchContent } from "@/lib/data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchContent(query);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
