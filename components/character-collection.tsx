import Image from "next/image"
import { Lock } from "lucide-react"

interface CharacterCollectionProps {
  characterId: string
}

export function CharacterCollection({ characterId }: CharacterCollectionProps) {
  // In a real app, you would fetch the character's images based on the ID
  // For this example, we'll create mock data

  // Generate 18 images, with only the first one unlocked
  const images = Array.from({ length: 18 }, (_, i) => ({
    id: `${characterId}-${i}`,
    unlocked: i === 0,
    image: i === 0 ? "/placeholder.svg?height=400&width=400" : "",
  }))

  // Group images into rows of 9
  const rows = Array.from({ length: Math.ceil(images.length / 9) }, (_, i) => images.slice(i * 9, i * 9 + 9))

  return (
    <div className="space-y-8">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {row.map((image) => (
            <div key={image.id} className="relative aspect-square rounded-lg border border-border overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-card">
                {image.unlocked ? (
                  <Image src={image.image || "/placeholder.svg"} alt="Character image" fill className="object-cover" />
                ) : (
                  <Lock className="text-muted-foreground" size={24} />
                )}
              </div>

              {/* Decorative elements at top of each card */}
              <div className="absolute top-0 left-0 w-full">
                <svg viewBox="0 0 100 20" className="w-full">
                  <path d="M0,10 C30,30 70,0 100,10 L100,0 L0,0 Z" fill={rowIndex === 0 ? "#8B7500" : "#3B3B6D"} />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
