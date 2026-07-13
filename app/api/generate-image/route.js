import { NextResponse } from "next/server";

const HF_MODEL = "black-forest-labs/FLUX.1-schnell";
const HF_API_URL = `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`;

export async function POST(request) {
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

    const payload = {
      inputs: prompt,
      parameters: {
        width: width || 1024,
        height: height || 1024,
      },
    };

    if (negative_prompt) {
      payload.parameters.negative_prompt = negative_prompt;
    }

    let response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.status === 503) {
      const body = await response.json();
      const estimatedTime = body.estimated_time || 30;

      await new Promise((resolve) =>
        setTimeout(resolve, estimatedTime * 1000)
      );

      response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API error:", response.status, errorText);
      return NextResponse.json(
        {
          error: `Image generation failed (${response.status}). ${response.status === 429 ? "Rate limited - try again later." : "Please try again."}`,
        },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await response.json();
      if (data.error) {
        return NextResponse.json(
          { error: data.error },
          { status: 500 }
        );
      }
    }

    const imageBuffer = await response.arrayBuffer();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Generate image error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
