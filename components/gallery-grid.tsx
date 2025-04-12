import Link from "next/link"
import Image from "next/image"

// Mock data for characters
const characters = [
  { id: "1", name: "Ver Terger", image: "/placeholder.svg?height=400&width=400" },
  { id: "2", name: "Alice", image: "/placeholder.svg?height=400&width=400" },
  { id: "3", name: "Andrew", image: "/placeholder.svg?height=400&width=400" },
  { id: "4", name: "Anna", image: "/placeholder.svg?height=400&width=400" },
  { id: "5", name: "Asami", image: "/placeholder.svg?height=400&width=400" },
  { id: "6", name: "Aurelia", image: "/placeholder.svg?height=400&width=400" },
  { id: "7", name: "Beth", image: "/placeholder.svg?height=400&width=400" },
  { id: "8", name: "Britney", image: "/placeholder.svg?height=400&width=400" },
  { id: "9", name: "Catie", image: "/placeholder.svg?height=400&width=400" },
  { id: "10", name: "Chun-Li", image: "/placeholder.svg?height=400&width=400" },
  { id: "11", name: "Clementine", image: "/placeholder.svg?height=400&width=400" },
  { id: "12", name: "Damien", image: "/placeholder.svg?height=400&width=400" },
  { id: "13", name: "Dorian", image: "/placeholder.svg?height=400&width=400" },
  { id: "14", name: "Hanna", image: "/placeholder.svg?height=400&width=400" },
]

export function GalleryGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-4">
      {characters.map((character) => (
        <Link href={`/gallery/${character.id}`} key={character.id} className="relative group">
          <div className="relative overflow-hidden rounded-lg border border-border bg-card transition-all duration-200 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-1">
            <div className="relative aspect-square">
              <Image src={character.image || "/placeholder.svg"} alt={character.name} fill className="object-cover" />
            </div>
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent p-2 text-center">
              <h3 className="text-sm font-medium text-white">{character.name}</h3>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
