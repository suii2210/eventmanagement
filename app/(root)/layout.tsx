import type { Metadata } from "next";
import {Poppins} from "next/font/google";
import Header from  "@/components/shared/Header";
import Footer from  "@/components/shared/Footer";






export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   <div className="flex h-screen flex-col">
        <Header />
      <main className="flex-1"> {children} </main>
     <Footer />

     </div>
  );
}
