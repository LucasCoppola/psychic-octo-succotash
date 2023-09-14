'use server'

import prisma from '@/lib/prisma'
import type { Attachment } from '@prisma/client'
import { utapi } from 'uploadthing/server'

export async function getCards({ listId }: { listId: string }) {
	try {
		const cards = await prisma.card.findMany({
			where: {
				listId
			}
		})

		return { cards }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function createCard({
	listId,
	title,
	authorId
}: {
	listId: string
	title: string
	authorId: string
}) {
	try {
		const createCard = await prisma.card.create({
			data: {
				authorId,
				listId,
				title
			}
		})

		return { createCard }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function updateCardDescription({
	userId,
	authorId,
	cardId,
	description
}: {
	userId: string
	authorId: string
	cardId: string
	description: string
}) {
	try {
		if (authorId !== userId) throw new Error('Unauthorized')

		const updateDescription = await prisma.card.update({
			where: {
				id: cardId
			},
			data: {
				description
			}
		})

		return { updateDescription }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function createAttachment({
	id,
	filename,
	url,
	size,
	userId,
	cardId
}: Omit<Attachment, 'uploadedAt'>) {
	try {
		const attachment = await prisma.attachment.create({
			data: {
				id,
				filename,
				url,
				size,
				userId,
				cardId
			}
		})

		return { attachment }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function getAttachments({ cardId }: { cardId: string }) {
	try {
		const attachments = await prisma.attachment.findMany({
			where: {
				cardId
			}
		})

		return { attachments }
	} catch (e) {
		console.error(e)
		return { e }
	}
}

export async function removeAttachment({
	cardId,
	attachmentId
}: {
	cardId: string
	attachmentId: string
}) {
	try {
		const removeAttachment = await prisma.attachment.delete({
			where: {
				cardId,
				id: attachmentId
			}
		})
		await utapi.deleteFiles(attachmentId)

		return { removeAttachment }
	} catch (e) {
		console.error(e)
		return { e }
	}
}
