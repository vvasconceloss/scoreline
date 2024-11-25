import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, Trophy, User } from "lucide-react"

export const AppSidebar = () => {
  const menuItems = [
    {
      title: 'Home',
      url: '/',
      icon: Home
    },
    {
      title: 'Leagues',
      url: '/leagues',
      icon: Trophy
    },
    {
      title: 'Transfers',
      url: '/transfers',
      icon: User
    }
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="dark:bg-slate-950">
      <SidebarMenu>
          <SidebarMenuItem >
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 text-sidebar-primary-foreground">
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-2xl">Scoreline</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-950">
      <SidebarMenu className="mt-5 space-y-2">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.title} className="px-2">
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </a>
              </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}