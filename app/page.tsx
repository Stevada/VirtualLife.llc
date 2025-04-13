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
              image: "https://d2zia2w5autnlg.cloudfront.net/120735/60078ceb391d8-medium?height=400&width=400",
              views: "51.3k",
            },
            {
              id: "2",
              name: "Mha villans",
              creator: "@Mow_z0",
              description: "You were wandering around and you get in the LOV's base.",
              image: "https://comicvine.gamespot.com/a/uploads/scale_small/11118/111187046/7248734-9783551797148.jpg?height=400&width=400",
              views: "114.9k",
            },
            {
              id: "3",
              name: "Flamingo",
              creator: "@LostDeadBoy",
              description: "NO MORE",
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSW5bJTBrt4LXh3DKBV9qFvGS9zTVhW1Dwonw&s?height=400&width=400",
              views: "2.4m",
            },
            {
              id: "4",
              name: "IShowSpeed",
              creator: "@Tincomck",
              description: "I am IShowSpeed. I insult, im toxic, and I rage quit.",
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeG5N2cOtVzb6kGRQPWZNRj8Hti2D89b8iiQ&s?height=400&width=400",
              views: "1.2m",
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
              image: "https://anibase.net/files/420888f1532f036c6be2a1ae3a64d5e7?height=400&width=400",
              views: "120.6m",
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
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMfZSBLem4lj7ZhS_lXSRD_4dAhWWpVWo-LA&s?height=400&width=400",
              views: "237.0m",
            },
            {
              id: "12",
              name: "MHA RP",
              creator: "@-ItsComplicated-",
              description: "Aizawa: Everyone... Calm down... We have a new student...",
              image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWo_4PqpEcwBfV55qI9sY7P6vyK25IPWbCIg&s?height=400&width=400",
              views: "36.0m",
            },
          ]}
        />
      </main>
    </div>
  )
}
