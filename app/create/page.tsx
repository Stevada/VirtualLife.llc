"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { generateCharacter } from "@/lib/generate-character"
import { useRouter } from "next/navigation"

export default function CreatePage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true)

    try {
      // In a real app, this would generate a character and return its ID
      const characterId = await generateCharacter(prompt)
      router.push(`/chat/${characterId}`)
    } catch (error) {
      console.error("Error generating character:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Create a New Character</h1>

          <div className="bg-card rounded-lg p-6 border border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Character Prompt</label>
                <Textarea
                  placeholder="Describe your character (e.g., 'a grumpy wizard who loves cats' or 'a shy android discovering human emotions')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="h-32"
                  required
                />
                <p className="text-xs text-muted-foreground mt-2">
                  The AI will generate a complete character based on your prompt, including personality, background, and
                  appearance.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isGenerating || !prompt.trim()}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Character"
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Or choose a template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Fantasy Hero",
                "Sci-Fi Companion",
                "Historical Figure",
                "Mythical Creature",
                "Anime Character",
                "Supportive Friend",
              ].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-2"
                  onClick={() => setPrompt(`Create a ${template.toLowerCase()}`)}
                >
                  <span>{template}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
