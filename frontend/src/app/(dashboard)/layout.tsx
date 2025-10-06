import Navbar from "../../../components/layout/Navbar";
import Sidebar from "../../../components/layout/Sidebar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  bg-background"> 
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
       
        <main className="flex-1   bg-muted/50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}