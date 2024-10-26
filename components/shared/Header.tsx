import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Button } from '../ui/button'
import NavItems from './Navitems'
import MobileNav from './MobileNav'
import logo from "/public/assets/image/logo.png"

const Header = () => {
  return (
    <header className='w-full '>
      <div className='wrapper flex items-center justify-between rounded px-4 md:px-8 lg:px-16'> {/* Adjusted padding for responsiveness */}
        {/* Logo container */}
        <Link href="/" 
          className='w-24 sm:w-32 md:w-36'  // Responsive width for the logo
        >
          <Image
            src={logo}
            width={108}
            height={28}
            alt="Eventify logo"
            className='rounded-full relative right-20 '
          />
        </Link>

        <SignedIn>
          {/* Desktop Navigation - hidden on smaller screens */}
          <nav className='hidden md:flex max-w-xs relative left-96'>
            <NavItems />
          </nav>
        </SignedIn>

        <div className='ml-auto flex items-center gap-3'>
          <SignedIn>
            {/* User button for signed-in users */}
            <UserButton afterSignOutUrl="/" />
            {/* Mobile navigation only visible on smaller screens */}
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <Button asChild className='rounded-full' size="lg">
              <Link href="/sign-in">
                Login
              </Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header
