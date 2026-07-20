import { NextResponse } from "next/server";

export async function GET(request) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { getAdminAuth, getAdminDb } = await import("@/lib/firebase-admin");
    const decoded = await getAdminAuth().verifySessionCookie(token, true);
    const userDoc = await getAdminDb().collection("users").doc(decoded.uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();

    return NextResponse.json({
      user: { id: decoded.uid, email: decoded.email, name: userData.name },
    });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
