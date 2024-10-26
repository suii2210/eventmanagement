import React from 'react'
import Image from 'next/image'
import menu from '/public/assets/icons/menu.svg'
import logo from "/public/assets/image/logo.png"
import { Separator } from "@/components/ui/separator"


import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import Navitems from './Navitems'
  

const MobileNav = () => {
  return (
   <nav className='md:hidden'>
    <Sheet>
    <SheetTrigger className='align-middle '>
        <Image
        src={menu}
        alt="menu"
        width={34}
        height={34}
        className='cursor-pointer '
        />
    </SheetTrigger>

    <SheetContent className='flex flex-col gap-6  md:hidden '>
      <Image 
      src={logo}
      alt="logo"
      width={68}
      height={38}
      className='rounded-full'
      />

      
    <Separator  className='border border-gray-50 ' /> 
    <Navitems/>
  </SheetContent>
</Sheet>

   </nav>
  )
}

export default MobileNav;





