import { Sidebar } from "@/components/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GalleryGrid } from "@/components/gallery-grid"

export default function GalleryPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="border-b border-border">
          <Tabs defaultValue="collection" className="max-w-screen-xl mx-auto">
            <TabsList className="w-full justify-start px-6 h-16">
              <TabsTrigger value="collection" className="text-lg px-8">
                Collection
              </TabsTrigger>
              <TabsTrigger value="album" className="text-lg px-8">
                Album
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="collection" className="mt-0">
                <GalleryGrid />
              </TabsContent>
              <TabsContent value="album" className="mt-0">
                <div className="text-center py-12">
                  <h3 className="text-xl">Album feature coming soon</h3>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
