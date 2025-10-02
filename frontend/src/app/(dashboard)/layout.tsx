import Navbar from "../../../components/layout/Navbar";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background"> 
      {/* <Sidebar /> */}
      <div className="flex-1 flex flex-col overflow-hidden">
       <Navbar title="sdfsadf"/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}