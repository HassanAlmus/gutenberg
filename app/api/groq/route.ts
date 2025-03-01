// app/api/groq/route.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Initialize the Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    const { messages, model = "llama-3.3-70b-versatile" } = body;
    
    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }
    
    // Call the Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages,
      model,
    });
    
    // Return the response
    return NextResponse.json(chatCompletion);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
    console.error('Groq API error:', error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}