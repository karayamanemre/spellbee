import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { LangToggle } from "./LangToggle";

export const Navbar = () => {
	return (
		<nav className='p-2 flex items-center justify-between max-w-xl mx-auto gap-10'>
			<LangToggle />
			<ModeToggle />
		</nav>
	);
};
