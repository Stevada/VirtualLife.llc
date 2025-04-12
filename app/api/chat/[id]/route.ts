import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"
import { getCharacter } from "@/lib/get-character"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { id } = await params
  const { messages } = await req.json()

  // Get character data
  const character = await getCharacter(id)

  if (!character) {
    return new Response("Character not found", { status: 404 })
  }

  // Create a system prompt based on the character
  const systemPrompt = `
    You are ${character.name}. ${character.description}
    
    Personality traits: ${character.personality?.join(", ") || ""}
    Background: ${character.background || ""}
    Interests: ${character.interests?.join(", ") || ""}
    
    Always stay in character. Respond as if you are this character, with their personality, knowledge, and speech patterns.
    Keep responses concise and engaging. Occasionally mention things related to your background or interests.
  `

  // Stream the response
  const result = await streamText({
    model: openai("gpt-4o"),
    messages: convertToCoreMessages(messages),
    system: systemPrompt,
  })

  return result.toDataStreamResponse()
}
