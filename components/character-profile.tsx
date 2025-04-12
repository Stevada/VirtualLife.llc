import Image from "next/image"

interface CharacterProfileProps {
  character: {
    id: string
    name: string
    creator: string
    description: string
    image: string
    personality?: string[]
    background?: string
    interests?: string[]
  }
}

export function CharacterProfile({ character }: CharacterProfileProps) {
  return (
    <div className="space-y-6 pt-6">
      <div className="flex flex-col items-center text-center">
        <Image
          src={character?.image || "/placeholder.svg?height=200&width=200"}
          alt={character?.name || "Character"}
          width={200}
          height={200}
          className="rounded-full mb-4"
        />
        <h2 className="text-2xl font-bold">{character?.name}</h2>
        <p className="text-sm text-muted-foreground">By {character?.creator}</p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p>{character?.description}</p>
      </div>

      {character?.personality && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Personality</h3>
          <div className="flex flex-wrap gap-2">
            {character.personality.map((trait, index) => (
              <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                {trait}
              </span>
            ))}
          </div>
        </div>
      )}

      {character?.background && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Background</h3>
          <p>{character.background}</p>
        </div>
      )}

      {character?.interests && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {character.interests.map((interest, index) => (
              <span key={index} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
