import Navbar from "../../../components/layout/Navbar";
import Sidebar from "../../../components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title="sdfsadf" />
        {/* CHANGE IS HERE 👇 */}
        <main className="flex-1 bg-background p-8 overflow-y-auto">
          {children} 
        </main>
      </div>
    </div>
  );
}