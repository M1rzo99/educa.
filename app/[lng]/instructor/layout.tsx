// app/[lng]/instructor/layout.tsx
import Navbar from '@/components/shared/navbar'
import Sidebar from '@/components/shared/sidebar'
import User from '@/database/user.model'
import { connectToDatabase } from '@/lib/mongoose'
import { ChildProps } from '@/types'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

async function guard(lng: string) {
  const { userId } = auth()
  if (!userId) redirect(`/${lng}/sign-in`)
  await connectToDatabase()
  const u = await User.findOne({ clerkId: userId }).select('role approvedInstructor').lean() as { role?: string; approvedInstructor?: boolean } | null
  const isInstructor = !!u && (u.role === 'instructor' || u.approvedInstructor === true)
  if (!isInstructor) redirect(`/${lng}/become-instructor`)
}

export default async function Layout({ children, params: { lng } }: ChildProps & { params: { lng: string } }) {
  await guard(lng)
  return (
    <>
      <Navbar />
      <Sidebar page='instructor' />
      <main className='w-full p-4 pl-[320px] pt-[12vh]'>
        <div className='size-full rounded-md bg-secondary px-4 pb-4'>{children}</div>
      </main>
    </>
  )
}
