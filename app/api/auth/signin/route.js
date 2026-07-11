import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Sign in via client-side Firebase Auth. Use POST /api/auth/session with an ID token." },
    { status: 400 }
  );
}
