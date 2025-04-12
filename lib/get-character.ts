// This is a mock function that would be replaced with actual API calls
export async function getCharacter(id: string) {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Mock data
  const characters = {
    "1": {
      id: "1",
      name: "Zane Romeave",
      creator: "@StarKeiko",
      description: "Aphmau's best friend, closed off, calm, annoyed.",
      image: "/placeholder.svg?height=400&width=400",
      personality: ["Calm", "Closed off", "Annoyed", "Loyal"],
      background:
        "Zane is Aphmau's best friend who tends to keep to himself. He's known for his calm demeanor but can get annoyed easily.",
      interests: ["Gaming", "Reading", "Solitude"],
    },
    "2": {
      id: "2",
      name: "Mha villans",
      creator: "@Mow_z0",
      description: "You were wandering around and you get in the LOV's base.",
      image: "/placeholder.svg?height=400&width=400",
      personality: ["Villainous", "Dangerous", "Unpredictable"],
      background:
        "The League of Villains (LOV) is a group of villains from the My Hero Academia universe. They operate from a hidden base and have various quirks and abilities.",
      interests: ["Villainy", "Chaos", "Power"],
    },
  }

  return characters[id as keyof typeof characters] || null
}
