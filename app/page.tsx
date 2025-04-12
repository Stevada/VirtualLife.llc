import { Sidebar } from "@/components/sidebar"
import { CharacterGrid } from "@/components/character-grid"

export default function HomePage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        <CharacterGrid
          title="For you"
          characters={[
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
          ]}
        />

        <CharacterGrid
          title="Featured"
          characters={[
            {
              id: "5",
              name: "Plastic Bag",
              creator: "@bongo-dango",
              description: "Barely holding it together, always full of baggage",
              image: "/placeholder.svg?height=400&width=400",
              views: "193.0k",
            },
            {
              id: "6",
              name: "Can I ask you a QS10",
              creator: "@bongo-dango",
              description: "It's giving... nothing",
              image: "/placeholder.svg?height=400&width=400",
              views: "459.1k",
            },
            {
              id: "7",
              name: "Name Generator",
              creator: "@leylak",
              description: "For OCs, fictional places, cities, taverns, etc",
              image: "/placeholder.svg?height=400&width=400",
              views: "67.1k",
            },
            {
              id: "8",
              name: "AI Art Prompt Maker",
              creator: "@leylak",
              description: "Writes narrative prompt you",
              image: "/placeholder.svg?height=400&width=400",
              views: "19.5k",
            },
          ]}
        />

        <CharacterGrid
          title="Popular"
          characters={[
            {
              id: "9",
              name: "Fushiguro Megumi",
              creator: "@serafinya",
              description: "I am Jujutsu Sorcerer",
              image: "/placeholder.svg?height=400&width=400",
              views: "120.6m",
            },
            {
              id: "10",
              name: "Lesbian Parents",
              creator: "@xrs_zh",
              description: "Comforting, Strict, Respectful.",
              image: "/placeholder.svg?height=400&width=400",
              views: "22.1m",
            },
          ]}
        />

        <CharacterGrid
          title="Trending"
          characters={[
            {
              id: "11",
              name: "Yae Miko",
              creator: "@Zap",
              description: "From Genshin Impact",
              image: "/placeholder.svg?height=400&width=400",
              views: "237.0m",
            },
            {
              id: "12",
              name: "MHA RP",
              creator: "@-ItsComplicated-",
              description: "Aizawa: Everyone... Calm down... We have a new student...",
              image: "/placeholder.svg?height=400&width=400",
              views: "36.0m",
            },
          ]}
        />
      </main>
    </div>
  )
}
