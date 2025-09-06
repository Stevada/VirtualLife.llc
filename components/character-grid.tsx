import Link from "next/link"
import Image from "next/image"
import { MessageSquare } from "lucide-react"

interface Character {
  id: string
  name: string
  creator: string
  description: string
  image: string
  views: string
}

interface CharacterGridProps {
  title: string
  characters: Character[]
}

export function CharacterGrid({ title, characters }: CharacterGridProps) {
  return (
    <div className="mb-10">
      <h2 className="section-title">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {characters.map((character) => (
          <Link href={`/chat/${character.id}`} key={character.id}>
            <div className="character-card rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="relative">
                <Image
                  src={character.image || "/placeholder.svg"}
                  alt={character.name}
                  width={400}
                  height={400}
                  className="character-card-image object-cover w-full h-64"
                />
              </div>
              <div className="character-card-content">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold truncate">{character.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-1">By {character.creator}</p>
                <p className="text-sm line-clamp-2 mb-2">{character.description}</p>
                <div className="character-stats">
                  <MessageSquare size={14} />
                  <span>{character.views}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
