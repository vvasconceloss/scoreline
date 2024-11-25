import { Header } from "@/components/header/header-component";
import { AppSidebar } from "@/components/sidebar/app-siderbar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


const Home = () => {
  return (
    <>
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
          <SidebarTrigger />
        <div className="flex items-center space-x-28">
          <Header />
        </div>
      </main>
    </SidebarProvider>
    </>
  )
}

export default Home;