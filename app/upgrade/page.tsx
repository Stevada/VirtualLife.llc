"use client"

import { X, FileText, Sliders, ArrowUp, Settings, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function UpgradePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#001a2e] text-white p-4">
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="max-w-md w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">
          Upgrade to <span className="text-white">Pro</span>
        </h1>

        <div className="space-y-4 mb-10">
          {/* Better Memory */}
          <div className="bg-[#0c2b43] rounded-lg p-4 flex items-start gap-4">
            <div className="bg-[#0099ff] p-2 rounded-md">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Better Memory</h2>
              <p className="text-gray-300">Characters remember more with frequent updates</p>
            </div>
          </div>

          {/* Chat Styles */}
          <div className="bg-[#0c2b43] rounded-lg p-4 flex items-start gap-4">
            <div className="bg-[#0099ff] p-2 rounded-md">
              <Sliders size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Chat Styles</h2>
              <p className="text-gray-300">Access our latest and best models</p>
            </div>
          </div>

          {/* Higher Limits */}
          <div className="bg-[#0c2b43] rounded-lg p-4 flex items-start gap-4">
            <div className="bg-[#0099ff] p-2 rounded-md">
              <ArrowUp size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Higher Limits</h2>
              <p className="text-gray-300">Longer personas, more muted words & swipes</p>
            </div>
          </div>

          {/* Customize Your Chats */}
          <div className="bg-[#0c2b43] rounded-lg p-4 flex items-start gap-4">
            <div className="bg-[#0099ff] p-2 rounded-md">
              <Settings size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Customize Your Chats</h2>
              <p className="text-gray-300">Response Length, image backgrounds, + more</p>
            </div>
          </div>

          {/* Exclusive Perks */}
          <div className="bg-[#0c2b43] rounded-lg p-4 flex items-start gap-4">
            <div className="bg-[#0099ff] p-2 rounded-md">
              <Ticket size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Exclusive Perks</h2>
              <p className="text-gray-300">Unlock new features first & invitation to the Pro community</p>
            </div>
          </div>
        </div>

        <Button className="w-full py-6 text-lg font-medium bg-[#0099ff] hover:bg-[#0088ee] rounded-lg">
          Subscribe for $9.99/mo
        </Button>
      </div>
    </div>
  )
}
