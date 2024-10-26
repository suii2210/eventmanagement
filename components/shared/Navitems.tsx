'use client'

import { headerLinks } from '@/constants';
import React from 'react'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navitems = () => {

  const pathname = usePathname()

  return (
   <ul className='md:flex-between flex text-fuchsia-50 w-full flex-col items-start gap-5 md:flex-row'>
    {headerLinks.map((link) => {
    
      const isActive = pathname === link.route;
    return(
      <li
      key={link.route}
      className={`${
        isActive && 'text-red-900'
      } flex-center p-medium-16 whitespace-nowrap`}
      >
        <Link href={link.route}>{link.label}</Link>
      </li>
    )
})}

   </ul>
  )
}

export default Navitems;