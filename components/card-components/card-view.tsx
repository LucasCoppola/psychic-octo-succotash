import Image from 'next/image'
import { MessageSquare, Paperclip } from 'lucide-react'
import type { Card, Label, User } from '@prisma/client'
import type { ColorProps, CoverImageType } from '@/app/types'
import SkeletonImage from '../loading/skeleton-image'
import SkeletonCard from '../loading/skeleton-card'
import DeleteCard from './delete-card'

type CardViewProps = {
	setOpen: (val: boolean) => void
	card: Card
	attachmentsLength: number
	commentsLength: number
	labels: Label[]
	coverImage: CoverImageType | null
	cardMembers: Omit<User, 'email' | 'emailVerified'>[] | undefined
	isCoverImageLoading: boolean
	listId: string
}

export default function CardView({
	setOpen,
	card,
	attachmentsLength,
	commentsLength,
	labels,
	coverImage,
	cardMembers,
	isCoverImageLoading,
	listId
}: CardViewProps) {
	const remainingAvatars = cardMembers?.length! - 3

	return (
		<div className="bg-white rounded-xl shadow-md hover:shadow-lg space-y-2" style={{ width: '243px' }}>
			<div className="relative">
				{!isCoverImageLoading && <DeleteCard cardId={card.id} cardAuthorId={card.authorId} listId={listId} />}

				{isCoverImageLoading ? (
					<SkeletonImage />
				) : coverImage ? (
					coverImage?.type === 'image' ? (
						<Image
							className="w-full h-[138px] rounded-t-xl object-cover"
							src={coverImage?.bg || ''}
							alt="card cover image"
							width={200}
							height={50}
							onClick={() => setOpen(true)}
						/>
					) : (
						<div
							className="w-full h-28 rounded-lg"
							onClick={() => setOpen(true)}
							style={{
								backgroundColor: coverImage?.bg
							}}
						></div>
					)
				) : null}
			</div>

			{isCoverImageLoading ? (
				<SkeletonCard />
			) : (
				<div className="px-3 pb-3 space-y-2" onClick={() => setOpen(true)}>
					<h3 className="font-medium">{card.title}</h3>
					<div className="flex flex-row gap-2 flex-wrap">
						{labels.length > 0 &&
							labels.map(({ color, id, name }) => {
								const parsedColor = JSON.parse(JSON.stringify(color)) as ColorProps

								return (
									<span
										key={id}
										className="text-[10px] rounded-sm px-2 py-[1px]"
										style={{
											backgroundColor: parsedColor.color.bg,
											color: parsedColor.color.text
										}}
									>
										{name}
									</span>
								)
							})}
					</div>
					<div className="flex flex-row justify-between items-center pt-2">
						<div className="flex -space-x-1 overflow-hidden items-center">
							{cardMembers &&
								cardMembers.map(({ image, name, id }) => (
									<Image
										key={id}
										src={image || ''}
										alt={`${name} avatar`}
										title={name!}
										className="w-6 h-6 inline-block rounded-full ring-2 ring-white"
										width={400}
										height={400}
									/>
								))}
							{remainingAvatars > 0 && (
								<span className="text-gray-500 text-xs tracking-tight pl-2">
									+{remainingAvatars} {remainingAvatars === 1 ? 'other' : 'others'}
								</span>
							)}
						</div>
						<div className="flex flex-row text-gray-500 items-center">
							{commentsLength > 0 && (
								<span className="flex flex-row text-xs mr-2 items-center" title="Comments">
									<MessageSquare className="h-3.5 w-3.5 mr-0.5" />
									{commentsLength}
								</span>
							)}
							{attachmentsLength > 0 && (
								<span className="flex flex-row text-xs items-center" title="Attachments">
									<Paperclip className="h-3.5 w-3.5 mr-0.5" />
									{attachmentsLength}
								</span>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
