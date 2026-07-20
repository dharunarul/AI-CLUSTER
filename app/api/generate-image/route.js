import { NextResponse } from "next/server";
import { InferenceClient } from "@huggingface/inference";

const HF_MODEL = "black-forest-labs/FLUX.1-dev";

async function generateWithProvider(client, provider, prompt, negative_prompt, width, height) {
  return client.textToImage({
    model: HF_MODEL,
    provider,
    inputs: prompt,
    parameters: {
      width: width || 1024,
      height: height || 1024,
      ...(negative_prompt ? { negative_prompt } : {}),
    },
  });
}

export async function POST(request) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { getAdminAuth } = await import("@/lib/firebase-admin");
    await getAdminAuth().verifySessionCookie(token);
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Hugging Face API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt, negative_prompt, width, height } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const client = new InferenceClient(apiKey);
    const providers = ["fal-ai", "replicate", "together", "nscale", "wavespeed"];
    let lastError = null;

    for (const provider of providers) {
      try {
        const imageBlob = await generateWithProvider(
          client,
          provider,
          prompt,
          negative_prompt,
          width,
          height
        );

        const imageBuffer = await imageBlob.arrayBuffer();

        if (imageBuffer.byteLength < 1000) {
          lastError = `Response too small from ${provider}`;
          continue;
        }

        return new NextResponse(imageBuffer, {
          headers: {
            "Content-Type": imageBlob.type || "image/png",
            "Cache-Control": "no-store",
          },
        });
      } catch (err) {
        console.error(`Provider ${provider} failed:`, err.message);
        lastError = `${provider}: ${err.message}`;
      }
    }

    return NextResponse.json(
      {
        error: `Image generation failed. All providers unavailable. ${lastError || ""}`,
      },
      { status: 502 }
    );
  } catch (error) {
    console.error("Generate image error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
