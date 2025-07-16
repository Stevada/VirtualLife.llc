"use client"

import { useState, useRef, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChat } from "ai/react"
import { Send, ImageIcon, Info } from "lucide-react"
import Image from "next/image"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CharacterProfile } from "@/components/character-profile"
import { getCharacter } from "@/lib/get-character"

interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params
  const [character, setCharacter] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: `/api/chat/${id}`,
    initialMessages: [],
  })

  useEffect(() => {
    const loadCharacter = async () => {
      try {
        const data = await getCharacter(id)
        setCharacter(data)
      } catch (error) {
        console.error("Error loading character:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCharacter()
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={character?.image || "/placeholder.svg?height=40&width=40"}
              alt={character?.name || "Character"}
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h1 className="font-semibold">{character?.name || "Character"}</h1>
              <p className="text-xs text-muted-foreground">By {character?.creator || "Unknown"}</p>
            </div>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <CharacterProfile character={character} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="max-w-md">
                <h2 className="text-2xl font-bold mb-2">{character?.name || "Character"}</h2>
                <p className="text-muted-foreground mb-6">{character?.description || ""}</p>
                <p>Start chatting to begin your conversation!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.role === "user" ? (
                    <div className="chat-bubble chat-bubble-user">{message.content}</div>
                  ) : (
                    <div>
                      <div className="chat-bubble chat-bubble-ai">{message.content}</div>
                      {/* Randomly show AI-generated selfies */}
                      {message.id.charCodeAt(0) % 5 === 0 && (
                        <div className="ml-1 mt-1">
                          <Image
                            src="/placeholder.svg?height=320&width=240"
                            alt="AI selfie"
                            width={240}
                            height={320}
                            className="chat-image"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Button type="button" variant="ghost" size="icon" className="shrink-0">
              <ImageIcon size={20} />
            </Button>
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send size={20} />
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
