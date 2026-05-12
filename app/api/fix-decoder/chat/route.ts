import { streamText, UIMessage, convertToModelMessages } from "ai";
import { openai } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/app/fix-decoder/constants";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: "No messages provided" }), {
        status: 400,
      });
    }

    const lastMessage = messages[messages.length - 1];
    const message =
      lastMessage?.parts
        ?.filter((p) => p.type === "text")
        ?.map((p) => p.text)
        ?.join(" ") ?? "";

    if (!message.trim()) {
      return new Response(JSON.stringify({ error: "Empty message content" }), {
        status: 400,
      });
    }

    const result = await streamText({
      model: openai(process.env.AI_MODEL ?? "gpt-4.1-mini"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages.slice(-8)),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error generating response:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate response" }),
      { status: 500 }
    );
  }
}
