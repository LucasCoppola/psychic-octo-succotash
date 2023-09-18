import { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Tags, Trash2 } from 'lucide-react'
import { useMutation, useQuery } from '@tanstack/react-query'
import {
	createLabel,
	getLabels,
	updateLabel
} from '@/app/server/card-operations/labels'
import type { ColorProps } from '@/app/types'

const colors: ColorProps[] = [
	{ color: { text: '#4b5563', bg: '#f3f4f6' }, colorName: 'Gray' },
	{ color: { text: '#dc2626', bg: '#fee2e2' }, colorName: 'Red' },
	{ color: { text: '#2563eb', bg: '#dbeafe' }, colorName: 'Blue' },
	{ color: { text: '#16a34a', bg: '#dcfce7' }, colorName: 'Green' },
	{ color: { text: '#ea580c', bg: '#ffedd5' }, colorName: 'Orange' },
	{ color: { text: '#ca8a04', bg: '#fef9c3' }, colorName: 'Yellow' },
	{ color: { text: '#db2777', bg: '#fce7f3' }, colorName: 'Pink' },
	{ color: { text: '#9333ea', bg: '#f3e8ff' }, colorName: 'Purple' }
]

export default function AddLabel({ cardId }: { cardId: string }) {
	const [label, setLabel] = useState('')
	const [previewColor, setPreviewColor] = useState<ColorProps | null>(null)
	const [hoveredLabelId, setHoveredLabelId] = useState<string | null>(null)

	useEffect(() => {
		setPreviewColor(
			colors[Math.floor(Math.random() * colors.length)] || null
		)
	}, [])

	const { data: labels, refetch: refetchLabels } = useQuery(
		['labels', cardId],
		async () => {
			const { labels } = await getLabels({ cardId })
			return labels
		}
	)

	const createLabelMutation = useMutation(
		async () => {
			const color = previewColor || {
				color: { text: '#2563eb', bg: '#dbeafe' },
				colorName: 'Blue'
			}
			await createLabel({ cardId, color, name: label })
		},
		{
			onSuccess: () => console.log('label created!'),
			onError: (e) =>
				console.error('Error Client:', (e as Error).message),
			onSettled: () => {
				setLabel('')
				refetchLabels()
			}
		}
	)

	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex flex-row items-center text-gray-700 text-sm ml-auto bg-gray-200 px-4 py-1.5 rounded-md w-4/5">
					<Tags className="h-4 w-4 mr-2" />
					Labels
				</button>
			</PopoverTrigger>
			<PopoverContent>
				<input
					type="text"
					placeholder="Search for a label..."
					className="bg-gray-50 border text-xs border-gray-300 text-gray-800 rounded-md w-full px-2 py-1 focus:outline-none focus:ring-2 hover:ring-1 hover:ring-blue-200 focus:ring-blue-200 my-1"
					value={label}
					onChange={(e) => setLabel(e.target.value)}
				/>
				<span className="text-xs text-gray-700 font-medium">
					Select a label or create one
				</span>
				<ul className="text-xs">
					{labels?.map(({ id, name, color }) => {
						const parsedColor = JSON.parse(
							JSON.stringify(color)
						) as ColorProps

						return (
							<li
								key={id}
								className={`hover:bg-gray-100 rounded-sm py-1 px-2 cursor-pointer flex flex-row justify-between ${
									hoveredLabelId === id ? 'bg-gray-100' : ''
								}`}
								onMouseEnter={() => setHoveredLabelId(id)}
								onMouseLeave={() => setHoveredLabelId(null)}
							>
								<span
									className="text-[10px] rounded-sm px-2 py-[1px]"
									style={{
										backgroundColor: parsedColor.color.bg,
										color: parsedColor.color.text
									}}
								>
									{name}
								</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										{hoveredLabelId === id && (
											<MoreHorizontal
												className="h-4 w-4 text-gray-500 hover:bg-gray-200 rounded-sm"
												strokeWidth={2.5}
											/>
										)}
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<UpdateLabel
											cardId={cardId}
											color={parsedColor}
											labelId={id}
											name={name}
											refetchLabels={refetchLabels}
											hoveredLabelId={hoveredLabelId}
										/>
										{/* <DropdownMenuItem>
											<div
												role="button"
												className="flex flex-row items-center text-gray-700"
											>
												<Trash2 className="h-4 w-4 mr-2" />
												Delete
											</div>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<span className="text-gray-500 uppercase text-xs font-medium pl-2">
											Colors
										</span>
										{colors.map(({ color, colorName }) => (
											<DropdownMenuItem
												key={colorName}
												className="flex flex-row items-center py-1"
											>
												<div
													className="h-4 w-4 rounded-sm border"
													style={{
														backgroundColor:
															color.bg,
														color: color.text
													}}
												/>
												<span className="text-xs rounded-sm ml-2 py-[1px] text-gray-700">
													{colorName}
												</span>
											</DropdownMenuItem>
										))} */}
									</DropdownMenuContent>
								</DropdownMenu>
							</li>
						)
					})}

					{label && (
						<div
							className="text-xs hover:bg-gray-100 rounded-sm px-2 py-1 cursor-pointer mt-2"
							role="button"
							onClick={() => createLabelMutation.mutate()}
						>
							Create
							<span
								className="text-[10px] text-emerald-600 bg-emerald-100 rounded-sm px-2 py-[1px] ml-1"
								style={{
									backgroundColor: previewColor?.color.bg,
									color: previewColor?.color.text
								}}
							>
								{label}
							</span>
						</div>
					)}
				</ul>
			</PopoverContent>
		</Popover>
	)
}

function UpdateLabel({
	name,
	labelId,
	color,
	cardId,
	hoveredLabelId,
	refetchLabels
}: {
	name: string
	labelId: string
	color: ColorProps
	cardId: string
	hoveredLabelId: string | null
	refetchLabels: () => void
}) {
	const [editLabelName, setEditLabelName] = useState(name)
	const [editColor, setEditColor] = useState(color)

	const mutateLabel = useMutation(
		async () => {
			if (editLabelName === name && editColor === color) return

			await updateLabel({
				cardId,
				color: editColor,
				labelId,
				name: editLabelName
			})
		},
		{
			onSettled: () => refetchLabels()
		}
	)

	useEffect(() => {
		if (editLabelName !== name || editColor !== color) {
			mutateLabel.mutate()
		}
	}, [editLabelName, editColor])

	return (
		<>
			<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
				<input
					type="text"
					className="w-32 p-1 border border-gray-300 text-xs rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
					value={editLabelName}
					onChange={(e) => {
						setEditLabelName(e.target.value)
						mutateLabel.mutate()
					}}
					autoFocus
				/>
			</DropdownMenuItem>
			<DropdownMenuItem>
				<div
					role="button"
					className="flex flex-row items-center text-gray-700 text-xs"
				>
					<Trash2 className="h-4 w-4 mr-2" />
					Delete
				</div>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<span className="text-gray-500 uppercase text-xs font-medium ">
				Colors
			</span>
			{colors.map(({ color, colorName }) => (
				<DropdownMenuItem
					key={colorName}
					role="button"
					className="flex flex-row items-center py-1"
					onClick={() => {
						setEditColor({ color, colorName })
						mutateLabel.mutate()
					}}
				>
					<div
						className="h-4 w-4 rounded-sm border"
						style={{
							backgroundColor: color.bg,
							color: color.text
						}}
					/>
					<span className="text-xs rounded-sm ml-2 py-[1px] text-gray-700">
						{colorName}
					</span>
				</DropdownMenuItem>
			))}
		</>
	)
}
