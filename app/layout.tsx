import type { Metadata } from "next";

import "./globals.css";
import {  ClerkProvider,
 } from "@clerk/nextjs";



export const metadata: Metadata = {
  title: "Eventify",
  description: "Eventify is the platform use for the event management",
  icons:{
    icon:'/assets/images/logo.svg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
         
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
