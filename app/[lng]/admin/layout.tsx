import Navbar from '@/components/shared/navbar'
import Sidebar from '@/components/shared/sidebar'
import { ChildProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { connectToDatabase } from '@/lib/mongoose'
import User from '@/database/user.model'

async function guard(lng: string) {
  const { userId } = auth()
  if (!userId) redirect(`/${lng}/sign-in`)
  await connectToDatabase()
  const u = await User.findOne({ clerkId: userId }).select('isAdmin').lean() as { isAdmin?: boolean } | null
  if (!u || !u.isAdmin) redirect(`/${lng}`)
}

export default async function Layout({ children, params: { lng } }: ChildProps & { params: { lng: string } }) {
  await guard(lng)
  return (
    <>
      <Navbar />
      <Sidebar page='admin' />
      <main className='w-full p-4 pl-[320px] pt-[12vh]'>
        <div className='size-full rounded-md bg-secondary px-4 pb-4'>{children}</div>
      </main>
    </>
  )
}
