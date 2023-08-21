import { BoardProps } from '@/app/server'
import Image from 'next/image'
import { Globe, Lock } from './icons'

const avatars = [
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' },
	{ img: 'https://github.com/shadcn.png', name: 'shadcn' }
]

export default function BoardCard({
	title,
	coverImage,
	visibility
}: BoardProps) {
	const remainingAvatars = avatars.length - 3

	return (
		<div className="bg-white border rounded-xl shadow w-60 h-60">
			{coverImage.type === 'color' ? (
				<div
					className="w-full h-[138px] rounded-t-xl mb-3"
					style={{
						backgroundColor: coverImage.bg
					}}
				></div>
			) : (
				<Image
					className="w-full h-[138px] rounded-t-xl object-cover mb-3"
					src={coverImage.bg}
					alt="Board cover image"
					width={200}
					height={50}
				/>
			)}
			<div className="px-3 mb-4">
				<div className="flex items-center justify-between mb-4">
					<h5
						className={`${
							title.length > 24 && 'truncate'
						} font-medium tracking-tight text-gray-800`}
					>
						{title}
					</h5>
					{visibility === 'PUBLIC' ? (
						<Globe title="Public" className="h-4 w-4" />
					) : (
						<Lock
							title="Private"
							className="h-4 w-4 text-gray-700"
						/>
					)}
				</div>
				<div className="flex space-x-3 flex-row items-center">
					{avatars.slice(0, 3).map(({ img, name }, i) => (
						<img
							key={i}
							src={img}
							alt={`${name} avatar`}
							title={name}
							className="w-8 h-8 rounded-lg"
						/>
					))}
					{remainingAvatars > 0 && (
						<span className="text-gray-500 text-sm tracking-tight">
							+{remainingAvatars}{' '}
							{remainingAvatars === 1 ? 'other' : 'others'}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
