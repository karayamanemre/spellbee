import Link from "next/link";
import { ModeToggle } from "./ModeToggle";

export const Navbar = () => {
	return (
		<nav className='p-4 flex items-center justify-center gap-10 border-b shadow-sm'>
			<ul className='flex space-x-4 justify-center'>
				<li>
					<Link href='/en'>
						<p className='hover:underline'>English</p>
					</Link>
				</li>
				<li>
					<Link href='/tr'>
						<p className='hover:underline'>Türkçe</p>
					</Link>
				</li>
			</ul>
			<ModeToggle />
		</nav>
	);
};
