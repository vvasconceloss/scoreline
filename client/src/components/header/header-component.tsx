import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export const Header = () => {
  return (
    <header className="w-full flex items-center justify-between px-10 pb-5 border-b-2 ">
      <div className="py-2 space-y-1">
        <h2 className="text-xl">Making every day a sports day</h2>
        <h1 className="text-3xl font-semibold">Welcome to Scoreline</h1>
      </div>
      <div className="flex items-center space-x-10">
        <div className="space-x-5">
          <Button variant="outline" className="rounded-full w-11 h-11">
            <Settings />
          </Button>
          <Button variant="outline" className="rounded-full w-11 h-11">
            <Bell />
          </Button>
        </div>
        <div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}