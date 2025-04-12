import { Sidebar } from "@/components/sidebar"
import { CharacterGrid } from "@/components/character-grid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DiscoverPage() {
  // Mock data for different categories
  const categories = [
    {
      id: "all",
      title: "All Characters",
      characters: [
        {
          id: "1",
          name: "Zane Romeave",
          creator: "@StarKeiko",
          description: "Aphmau's best friend, closed off, calm, annoyed.",
          image: "/placeholder.svg?height=400&width=400",
          views: "51.3k",
        },
        {
          id: "2",
          name: "Mha villans",
          creator: "@Mow_z0",
          description: "You were wandering around and you get in the LOV's base.",
          image: "/placeholder.svg?height=400&width=400",
          views: "114.9k",
        },
        {
          id: "5",
          name: "Plastic Bag",
          creator: "@bongo-dango",
          description: "Barely holding it together, always full of baggage",
          image: "/placeholder.svg?height=400&width=400",
          views: "193.0k",
        },
        {
          id: "9",
          name: "Fushiguro Megumi",
          creator: "@serafinya",
          description: "I am Jujutsu Sorcerer",
          image: "/placeholder.svg?height=400&width=400",
          views: "120.6m",
        },
      ],
    },
    {
      id: "anime",
      title: "Anime",
      characters: [
        {
          id: "9",
          name: "Fushiguro Megumi",
          creator: "@serafinya",
          description: "I am Jujutsu Sorcerer",
          image: "/placeholder.svg?height=400&width=400",
          views: "120.6m",
        },
        {
          id: "11",
          name: "Yae Miko",
          creator: "@Zap",
          description: "From Genshin Impact",
          image: "/placeholder.svg?height=400&width=400",
          views: "237.0m",
        },
      ],
    },
    {
      id: "gaming",
      title: "Gaming",
      characters: [
        {
          id: "3",
          name: "Flamingo",
          creator: "@LostDeadBoy",
          description: "NO MORE",
          image: "/placeholder.svg?height=400&width=400",
          views: "2.4m",
        },
        {
          id: "4",
          name: "IShowSpeed",
          creator: "@Tincomck",
          description: "I am IShowSpeed. I insult, im toxic, and I rage quit.",
          image: "/placeholder.svg?height=400&width=400",
          views: "1.2m",
        },
      ],
    },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Discover Characters</h1>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="anime">Anime</TabsTrigger>
            <TabsTrigger value="gaming">Gaming</TabsTrigger>
            <TabsTrigger value="fantasy">Fantasy</TabsTrigger>
            <TabsTrigger value="scifi">Sci-Fi</TabsTrigger>
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <CharacterGrid title={category.title} characters={category.characters} />
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
