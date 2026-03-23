import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="bg-[#050505] text-white min-h-screen font-sans selection:bg-blue-500/30">
      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR: Stays fixed on the left */}
       

        {/* CONTENT AREA: Wraps everything else */}
        <div className="flex flex-1 flex-col relative min-w-0">
          
          {/* HEADER: If you want it visible on all pages, uncomment below */}
          {/* <Header title="InfyShield Dashboard" /> */}

          <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide flex flex-col">
            
            {/* ACTUAL PAGE CONTENT */}
            <div className="flex-1">
               {children}
            </div>

            {/* FOOTER: Attached to the bottom of the scrollable area */}
            <Footer />
          </main>
          
        </div>  
      </div>
    </section>
  )
}