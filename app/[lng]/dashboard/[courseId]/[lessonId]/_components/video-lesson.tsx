'use client'

import { completeLesson, getNextLesson } from '@/actions/lesson.action'
import { ILesson } from '@/app.types'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import useTranslate from '@/hooks/use-translate'
import { cn } from '@/lib/utils'
import { useAuth } from '@clerk/nextjs'
import Vimeo from '@vimeo/player'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface Props { lesson: ILesson }
function VideoLesson({ lesson }: Props) {
  const [isLoading, setIsLoading] = useState(true)

  const vimeoPlayerRef = useRef<HTMLDivElement | null>(null)
  const params = useParams() as { lng: string; courseId: string; lessonId?: string }
  const router = useRouter()
  const pathname = usePathname()
  const { userId } = useAuth()
  const t = useTranslate()

  useEffect(() => {
    if (!vimeoPlayerRef.current) return
    const player = new Vimeo(vimeoPlayerRef.current, {
      id: Number(lesson.videoUrl), // faqat raqamli Vimeo ID
      responsive: true,
      autoplay: true,
    })

    player.ready().then(() => setIsLoading(false))
    const handleEnded = () => onEnd()
    player.on('ended', handleEnded)

    return () => {
      player.off('ended', handleEnded)
      // player.destroy() // xohlasangiz qo‘shing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, pathname])

  const onEnd = async () => {
    if (!userId) {
      toast.error('Please sign in')
      return
    }
    setIsLoading(true)

    try {
      // parallel: nav keyingi dars + progressni belgilash
      const [next] = await Promise.all([
        getNextLesson(lesson._id, params.courseId),
        completeLesson(lesson._id, userId, pathname),
      ])

      // next yo‘q — oxirgi dars: kurs/overviewga qaytish
      if (!next) {
        toast.success(t('successfully'))
        router.push(`/${params.lng}/course/${params.courseId}`)
        return
      }

      // next bor — to‘g‘ri yo‘lga (til prefiksi bilan) o‘tamiz
      router.push(
        `/${params.lng}/dashboard/${params.courseId}/${next.lessonId}?s=${next.sectionId}`
      )
      toast.success(t('successfully'))
    } catch (e) {
      toast.error(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && (
        <div className='relative h-[20vh] w-full rounded-md bg-secondary sm:h-[30] md:h-[50vh] lg:h-[75vh]'>
          <Skeleton className='absolute right-0 top-0 flex size-full items-center justify-center rounded-md bg-slate-500/20'>
            <Loader2 className='size-6 animate-spin text-primary' />
          </Skeleton>
        </div>
      )}

      <div
        className={cn('max-md:sticky top-[10vh] z-50', isLoading && 'hidden')}
        ref={vimeoPlayerRef}
      />

      <div className='mt-4 flex flex-col gap-2 rounded-md bg-gradient-to-t from-background to-secondary p-4 md:flex-row md:items-center md:justify-between lg:p-6'>
        <h2 className='mt-4 font-space-grotesk text-2xl font-bold'>
          {lesson.title}
        </h2>
        <Button disabled={isLoading} onClick={onEnd}>
          <span className='pr-2'>{t('completeLesson')}</span>
          <CheckCircle size={18} />
        </Button>
      </div>
    </>
  )
}

export default VideoLesson
