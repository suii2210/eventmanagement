import type { Metadata } from "next";
import {Poppins} from "next/font/google";
import "./globals.css";
import {  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton } from "@clerk/nextjs";

const poppins = Poppins({
  subsets:['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

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
