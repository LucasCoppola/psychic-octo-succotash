'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import { Session } from 'next-auth'

export default function UserDropdown({ session }: { session: Session }) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement | null>(null)

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		) {
			setIsOpen(false)
		}
	}

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	if (!session.user?.email) return null

	return (
		<div className="relative" ref={dropdownRef}>
			<button
				id="dropdownAvatarNameButton"
				data-dropdown-toggle="dropdownAvatarName"
				className="flex items-center text-sm font-semibold text-gray-800 rounded-full md:mr-0 focus:ring-gray-100"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="sr-only">Open user menu</span>
				<Image
					src={
						session.user.image ||
						`https://avatars.dicebear.com/api/micah/${session.user.email}.svg`
					}
					className="mr-3 object-cover h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
					alt="avatar"
					width={400}
					height={400}
				/>
				{session.user.name}
				<svg
					className="w-2.5 h-2.5 ml-4"
					aria-hidden="true"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 10 6"
				>
					<path
						stroke="currentColor"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="m1 1 4 4 4-4"
					/>
				</svg>
			</button>

			<div
				id="dropdownAvatarName"
				className={`z-10 absolute right-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-md border w-44 ${
					isOpen
						? 'transition-all duration-200 opacity-100 transform translate-y-0'
						: 'transition-all duration-200 opacity-0 transform translate-y-[-10px] pointer-events-none'
				}`}
			>
				<div className="p-3 text-sm text-gray-500">
					<div className="truncate">{session.user.email}</div>
				</div>
				<ul
					className="py-1 text-sm mx-1 text-gray-700"
					aria-labelledby="dropdownInformdropdownAvatarNameButtonationButton"
				>
					<li>
						<a
							href="#"
							className="block p-2 hover:bg-gray-100 hover:rounded-sm"
						>
							Dashboard
						</a>
					</li>
					<li>
						<a
							href="#"
							className="block p-2 hover:bg-gray-100 hover:rounded-sm"
						>
							Settings
						</a>
					</li>
				</ul>
				<div className="py-1 mx-1">
					<button
						onClick={() =>
							signOut({ redirect: true, callbackUrl: '/' })
						}
						className="block w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-sm"
					>
						Sign out
					</button>
				</div>
			</div>
		</div>
	)
}
