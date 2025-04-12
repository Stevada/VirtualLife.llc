import { Search, Plus, Compass, Grid } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Sidebar() {
  return (
    <div className="w-64 h-full border-r border-border flex flex-col bg-card">
      <div className="p-4 border-b border-border">
        <Link href="/" className="text-xl font-bold">
          VirtualLife.ai
        </Link>
      </div>

      <div className="p-4 space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/create">
            <Plus size={18} />
            Create
          </Link>
        </Button>

        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/discover">
            <Compass size={18} />
            Discover
          </Link>
        </Button>

        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/gallery">
            <Grid size={18} />
            Gallery
          </Link>
        </Button>

        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search for Characters"
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-border text-xs text-muted-foreground">
        <div className="flex justify-between">
          <Link href="/privacy-policy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms-of-service" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
        </div>
        <Button variant="outline" className="w-full mt-4 text-primary">
          Upgrade to c.ai+
        </Button>
      </div>
    </div>
  )
}
