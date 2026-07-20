import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { uid, name, email, idToken } = await request.json();

    if (!uid || !name || !email || !idToken) {
      return NextResponse.json(
        { error: "UID, name, email, and idToken are required" },
        { status: 400 }
      );
    }

    const { getAdminAuth, getAdminDb } = await import("@/lib/firebase-admin");
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    if (decoded.uid !== uid) {
      return NextResponse.json(
        { error: "Token UID does not match provided UID" },
        { status: 403 }
      );
    }

    await getAdminDb().collection("users").doc(uid).set({
      name,
      email,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { user: { id: uid, name, email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup storage error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
