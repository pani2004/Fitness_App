import { NextRequest, NextResponse } from "next/server";
import { generateFitnessPlan } from "@/lib/ai/gemini-client";
import { userDetailsSchema } from "@/types/user";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = userDetailsSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: validationResult.error.issues },
        { status: 400 }
      );
    }
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }
    const plan = await generateFitnessPlan(validationResult.data);

    return NextResponse.json(plan, { status: 200 });
  } catch (error) {
    console.error("Error in generate-plan API:", error);
    
    return NextResponse.json(
      { 
        error: "Failed to generate fitness plan", 
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    );
  }
}
