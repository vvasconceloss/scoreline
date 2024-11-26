import { Header } from "@/components/header/header-component";
import { AppSidebar } from "@/components/sidebar/app-siderbar";
import { TodayMatch } from "@/components/today-match/TodayMatch";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Home = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger />
          <div className="flex flex-col">
            <Header />
            <div className="flex justify-between px-10 py-5">
              <TodayMatch />
            </div>
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};

export default Home;