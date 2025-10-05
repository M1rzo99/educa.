import ContactForm from '@/components/forms/contact.form'
import TopBar from '@/components/shared/top-bar'
import { translation } from '@/i18n/server'
import { LngParams } from '@/types'
import { Mail, Phone } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Praktikum | Bog`lanish',
	description:
		"Agar savolingiz bo'lsa, biz bilan bog'laning. Bizning operatorlarimiz sizga yordam berishga tayyorlar.",
}
async function Page({ params: { lng } }: LngParams) {
	const { t } = await translation(lng)

	return (
		<>
			<TopBar label='contacts' />
			<iframe
				src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d767609.1494093945!2d60.5430369873563!3d41.27680388760016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x41de3cbf7f89baef%3A0xe874bc482a2737e!2sXorazm%20Region%2C%20Uzbekistan!5e0!3m2!1sen!2skr!4v1759641984922!5m2!1sen!2skr"
				loading='lazy'
				className='h-96 w-full'
			/>

			<div className='container mx-auto max-w-6xl'>
				<div className='mt-6 grid grid-cols-2 gap-4 max-md:grid-cols-1'>
					<div className='flex flex-col'>
						<h1 className='font-space-grotesk text-4xl font-bold'>
							{t('contactTitle')}
						</h1>
						<p className='mt-2 text-muted-foreground'>
							{t('contactDescription')}
						</p>

						<div className='mt-12 flex items-center gap-3'>
							<Mail className='size-4' />
							<p className='text-sm'>info@educa.ac</p>
						</div>
						<div className='mt-2 flex items-center gap-3'>
							<Phone className='size-4' />
							<p className='text-sm'>+98 02 296 4902</p>
						</div>
					</div>

					<div>
						<h1 className='mb-2 font-space-grotesk text-4xl font-bold'>
							{t('contactForm')}
						</h1>
						<ContactForm />
					</div>
				</div>
			</div>
		</>
	)
}

export default Page
