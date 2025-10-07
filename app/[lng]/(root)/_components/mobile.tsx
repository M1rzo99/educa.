'use client'

import LanguageDropdown from '@/components/shared/language-dropdown'
import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,   // ⬅️ qo‘shildi
} from '@/components/ui/sheet'
import { navLinks } from '@/constants'
import useTranslate from '@/hooks/use-translate'
import { AlignCenter, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import GlobalSearch from './global-search'
import ModeToggle from '@/components/shared/mode-toggle'
import { useParams } from 'next/navigation'   // ⬅️ til (lng) uchun

function Mobile() {
  const t = useTranslate()
  const { lng } = useParams() as { lng: string } // /[lng]/... marshrutlar uchun

  return (
    // ⬇️ Dialog ichida boshqa dialog/command ochilishi uchun
    <Sheet modal={false}>
      <SheetTrigger asChild className='md:hidden'>
        <Button
          size='icon'
          variant='ghost'
          aria-label='mobile-hamburger-menu'
        >
          <AlignCenter />
        </Button>
      </SheetTrigger>

      <SheetContent side='top'>
        <SheetHeader>
          <Logo />
          <Separator />
        </SheetHeader>

        <div className='mt-4 flex flex-col space-y-3'>

          {/* Nav links */}
          {navLinks.map(nav => (
            <SheetClose asChild key={nav.route}>
              <Link
                href={`/${lng}/${nav.route}`}
                className='flex h-12 cursor-pointer items-center gap-2 rounded-sm px-3 transition-colors hover:bg-blue-400/20'
              >
                <nav.icon className='size-5' />
                <span>{t(nav.name)}</span>
              </Link>
            </SheetClose>
          ))}

          <LanguageDropdown isMobile />

          <div className='flex items-center justify-center gap-4'>

            {/* Cart (Link qilib qo‘ydik + bosilganda sheet yopiladi) */}
            <SheetClose asChild>
              <Link href={`/${lng}/shopping/cart`} aria-label='shopping-cart'>
                <Button size='icon' variant='ghost'>
                  <ShoppingCart />
                </Button>
              </Link>
            </SheetClose>

            {/* GlobalSearch — Sheet modal=false bo‘lgani uchun endi ochiladi */}
            <GlobalSearch />

            <ModeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Mobile
