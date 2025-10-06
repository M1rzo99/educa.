'use client'

import { Button } from '@/components/ui/button'
import { adminNavLinks, instructorNavLinks, profileNavLinks } from '@/constants'
import useTranslate from '@/hooks/use-translate'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Props {
  page: 'admin' | 'instructor' | 'user'
}

function Sidebar({ page }: Props) {
  const pathname = usePathname()
  const t = useTranslate()

  // URL dan joriy tilni ajratib olamiz: /en/..., /uz/..., /ru/..., /tr/...
  const lng = (pathname?.split('/')?.[1] || 'uz') as string

  const getNavLinks = () => {
    if (page === 'admin') return adminNavLinks
    if (page === 'instructor') return instructorNavLinks
    return profileNavLinks
  }

  return (
    <div className='fixed inset-0 mt-[10vh] h-[90vh] w-[300px] max-md:w-24'>
      <div className='mt-6 px-4 max-md:px-2'>
        <div className='flex flex-col space-y-3'>
          {getNavLinks().map(item => {
            const href = `/${lng}${item.route}`           // <<< MUHIM: locale prefiks
            const active = pathname?.startsWith(href)     // <<< Active yo'lni tekshirish
            return (
              <Link key={item.route} href={href}>
                <Button
                  className='flex w-full justify-start gap-2 max-md:w-fit max-md:justify-center'
                  variant={active ? 'secondary' : 'ghost'}
                >
                  <item.icon className='size-5 text-muted-foreground' />
                  <span className='max-md:hidden'>{t(item.label)}</span>
                </Button>
              </Link>
            )
          })}

          {/* Mobil logout tugmasi */}
          <Button
            className='flex w-full justify-start gap-2 max-md:w-fit md:hidden'
            variant='destructive'
          >
            <Link href={`/${lng}`}>
              <LogOut className='size-5 text-muted-foreground' />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
