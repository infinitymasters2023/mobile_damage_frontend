import Footer from "@/components/layout/Footer"
import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section className="bg-black text-white">
        <div className="flex min-h-screen">

          <Sidebar />

          <div className="flex flex-1 flex-col">           
            <main className="flex-1"> 
                {/* <Header title="OCR Purchase Device" /> */}
    {children}
     <Footer/></main>           
          </div>
        </div>
      </section>
  
}