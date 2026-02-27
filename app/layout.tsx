import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css"; // Ye line honi chahiye

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex flex-1 flex-col">
           
            <main className="flex-1">{children}</main>
           
          </div>
        </div>
      </body>
    </html>
  );
}