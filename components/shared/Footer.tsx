'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import logo from '/public/assets/image/logo.png'

const Header = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <header className="flex items-center p-4">
      {isClient && (
        <div className="relative h-auto">
          <Image
            src={logo}
            alt="Eventify logo"
            width={0}
            height={0}
            sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, (min-width: 1024px) 200px"
            className="w-[100px] sm:w-[150px] md:w-[200px] h-auto"
          />
        </div>
      )}
    </header>
  )
}

export default Header
