"use client"

import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function PricingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-white p-4 pt-16">
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
        aria-label="Close"
      >
        <X size={24} />
      </button>

      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Subscription Plans</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* FREE TIER */}
          <div className="bg-[#1c1c1c] rounded-lg overflow-hidden">
            <div className="bg-[#1c1c1c] p-4 text-center">
              <h2 className="text-2xl font-bold">FREE</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Message Queue</td>
                    <td className="p-3 text-right">Basic priority</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Unlock Rare Pictures</td>
                    <td className="p-3 text-right flex justify-end items-center">
                      <span className="text-[#c78fff]">♦</span> 50
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Daily Check-In Gems</td>
                    <td className="p-3 text-right flex justify-end items-center">
                      <span className="text-[#c78fff]">♦</span> 5
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Extra Gems Per Subscription</td>
                    <td className="p-3 text-right">0</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Personas Limit</td>
                    <td className="p-3 text-right">2</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Bot Memory Capacity</td>
                    <td className="p-3 text-right">Limited</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center">
              <Button className="w-full bg-gray-700 hover:bg-gray-600">Current Plan</Button>
            </div>
          </div>

          {/* Supreme TIER */}
          <div className="bg-[#1c1c1c] rounded-lg overflow-hidden border-2 border-[#c78fff]">
            <div className="bg-[#c78fff] p-4 text-center">
              <h2 className="text-2xl font-bold text-white">Supreme</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Message Queue</td>
                    <td className="p-3 text-right">Skip the line</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Unlock Rare Pictures</td>
                    <td className="p-3 text-right flex justify-end items-center">
                      <span className="text-[#c78fff]">♦</span> 30{" "}
                      <span className="ml-1 text-xs text-[#c78fff]">40%OFF</span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Daily Check-In Gems</td>
                    <td className="p-3 text-right">
                      Extra <span className="text-[#c78fff]">♦</span> 45
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Extra Gems Per Subscription</td>
                    <td className="p-3 text-right flex justify-end items-center">
                      <span className="text-[#c78fff]">♦</span> 450
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Personas Limit</td>
                    <td className="p-3 text-right">10</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Bot Memory Capacity</td>
                    <td className="p-3 text-right">High</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center">
              <Button className="w-full bg-[#c78fff] hover:bg-[#b57aee] text-white">Subscribe $9.99/mo</Button>
            </div>
          </div>

          {/* PRO TIER */}
          <div className="bg-[#1c1c1c] rounded-lg overflow-hidden">
            <div className="bg-[#2a9d8f] p-4 text-center">
              <h2 className="text-2xl font-bold text-white">Pro</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Message Queue</td>
                    <td className="p-3 text-right">Top priority</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Unlock Rare Pictures</td>
                    <td className="p-3 text-right flex justify-end items-center">
                      <span className="text-[#c78fff]">♦</span> 40{" "}
                      <span className="ml-1 text-xs text-[#c78fff]">20%OFF</span>
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Daily Check-In Gems</td>
                    <td className="p-3 text-right">
                      Extra <span className="text-[#c78fff]">♦</span> 25
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Extra Gems Per Subscription</td>
                    <td className="p-3 text-right flex justify-end items-center">
                      <span className="text-[#c78fff]">♦</span> 250
                    </td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Personas Limit</td>
                    <td className="p-3 text-right">5</td>
                  </tr>
                  <tr className="border-t border-gray-700">
                    <td className="p-3 text-gray-300">Bot Memory Capacity</td>
                    <td className="p-3 text-right">Enhanced</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-4 text-center">
              <Button className="w-full bg-[#2a9d8f] hover:bg-[#238a7e] text-white">Subscribe $6.99/mo</Button>
            </div>
          </div>
        </div>

        {/* GEMS SECTION */}
        <div className="mt-16">
          <h2 className="text-4xl font-bold text-center mb-2">GEMS</h2>
          <p className="text-center text-gray-300 mb-10">All gem bundles are a one-time purchase</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 1110 Gems */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-[#6c8cff] text-white text-center py-1 rounded-t-lg font-medium">
                Most Popular
              </div>
              <div className="bg-[#1c1c1c] rounded-lg pt-10 pb-4 flex flex-col items-center">
                <div className="mb-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoAKsL0HxRt1N-GMwxua9nzg1-NkvSuU4Sv6bkD1l-dOaI5givkEYO_Mq87GF5FdvKMZE&usqp=CAU?height=80&width=80"
                      alt="Green gem"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center mb-6">
                  <span className="text-[#c78fff] mr-2">♦</span>
                  <span className="text-3xl font-bold">1110</span>
                </div>
                <div className="bg-[#6c8cff] w-full py-3 text-center text-white text-xl font-bold">$ 14.99</div>
              </div>
            </div>

            {/* 2400 Gems */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-[#6c8cff] text-white text-center py-1 rounded-t-lg font-medium"/>
              <div className="bg-[#1c1c1c] rounded-lg pt-10 pb-4 flex flex-col items-center">
                <div className="mb-4">
                    <div className="w-20 h-20 relative">
                    <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoAKsL0HxRt1N-GMwxua9nzg1-NkvSuU4Sv6bkD1l-dOaI5givkEYO_Mq87GF5FdvKMZE&usqp=CAU?height=80&width=80"
                        alt="Green gem"
                        width={80}
                        height={80}
                        className="object-contain"
                    />
                    </div>
                </div>
                <div className="flex items-center justify-center mb-6">
                    <span className="text-[#c78fff] mr-2">♦</span>
                    <span className="text-3xl font-bold">2400</span>
                </div>
                <div className="bg-[#6c8cff] w-full py-3 text-center text-white text-xl font-bold">$ 29.99</div>
              </div>
            </div>
            {/* 5700 Gems */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-[#6c8cff] text-white text-center py-1 rounded-t-lg font-medium"/>
                <div className="bg-[#1c1c1c] rounded-lg pt-10 pb-4 flex flex-col items-center">
                <div className="mb-4">
                <div className="w-20 h-20 relative">
                  <Image
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoAKsL0HxRt1N-GMwxua9nzg1-NkvSuU4Sv6bkD1l-dOaI5givkEYO_Mq87GF5FdvKMZE&usqp=CAU?height=80&width=80"
                    alt="Green gem"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mb-6">
                <span className="text-[#c78fff] mr-2">♦</span>
                <span className="text-3xl font-bold">5700</span>
              </div>
              <div className="bg-[#6c8cff] w-full py-3 text-center text-white text-xl font-bold">$ 59.99</div>
            </div>
            </div>

            {/* 11790 Gems */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 bg-[#c78fff] text-white text-center py-1 rounded-t-lg font-medium">
                Most Valuable
              </div>
              <div className="bg-[#1c1c1c] rounded-lg pt-10 pb-4 flex flex-col items-center">
                <div className="mb-4">
                  <div className="w-20 h-20 relative">
                    <Image
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoAKsL0HxRt1N-GMwxua9nzg1-NkvSuU4Sv6bkD1l-dOaI5givkEYO_Mq87GF5FdvKMZE&usqp=CAU?height=80&width=80"
                      alt="Green gem"
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center mb-6">
                  <span className="text-[#c78fff] mr-2">♦</span>
                  <span className="text-3xl font-bold">11790</span>
                </div>
                <div className="bg-[#c78fff] w-full py-3 text-center text-white text-xl font-bold">$ 99.99</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
