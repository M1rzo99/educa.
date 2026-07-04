'use server'

import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

export async function uploadCourseImage(formData: FormData) {
	const file = formData.get('file') as File
	if (!file) throw new Error('No file provided')

	const blob = await put(`praktikum/course/${uuidv4()}`, file, {
		access: 'public',
	})

	return blob.url
}
