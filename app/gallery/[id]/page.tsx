import { Sidebar } from "@/components/sidebar"
import { CharacterCollection } from "@/components/character-collection"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface CollectionPageProps {
  params: {
    id: string
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { id } = await params

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border p-4 flex items-center">
          <Link href="/gallery" className="mr-4">
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-2xl font-semibold">Collection</h1>
        </div>

        <div className="p-6">
          <CharacterCollection characterId={id} />
        </div>
      </main>
    </div>
  )
}
