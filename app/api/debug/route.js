import { NextResponse } from "next/server";

export async function GET() {
  const info = {
    nodeVersion: process.version,
    hasFirebasePrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasHfKey: !!process.env.HUGGINGFACE_API_KEY,
    hasUpstashUrl: !!process.env.UPSTASH_REDIS_REST_URL,
  };

  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    const auth = getAdminAuth();
    info.adminSdk = "initialized";
  } catch (e) {
    info.adminSdk = "FAILED";
    info.adminSdkError = e.message;
  }

  return NextResponse.json(info);
}
