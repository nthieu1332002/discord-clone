import Sidebar from "@/components/sidebar/Sidebar";

const MainLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <Sidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </div>
  );
};

export default MainLayout;
