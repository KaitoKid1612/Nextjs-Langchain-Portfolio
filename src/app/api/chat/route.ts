import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatCompletionMessageParam } from "ai/prompts";
import { StreamingTextResponse, GoogleGenerativeAIStream, Message } from "ai";

const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_API_KEY!,
);

export const runtime = "edge";

export async function POST(req: Request) {
    try {
      const reqBody = await req.json();

      const messages: Message[] = reqBody.messages;

      let modelName: string;
      let promptWithParts: any;

      modelName = "gemini-pro";
      promptWithParts = buildGoogleGenAIPrompt(messages);

      const model = genAI.getGenerativeModel({
        model: modelName,
      });

      console.log("MODELNAME: " + modelName);
      console.log("PROMPT WITH PARTS: ");
      console.log(promptWithParts);
      const streamingResponse = await model.generateContentStream(promptWithParts);
      return new StreamingTextResponse(GoogleGenerativeAIStream(streamingResponse));
        
    
    } catch (error: any) {
        return new Response(JSON.stringify({ error: "Internal server error", message: error.message }), { status: 500 });
    }  
}


function buildGoogleGenAIPrompt(messages: Message[]) {
  return {
    contents: messages
      .filter(
        (message) => message.role === "user" || message.role === "assistant"
      )
      .map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.content }],
      })),
  };
}