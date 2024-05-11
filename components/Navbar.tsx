import { LangToggle } from "./LangToggle";

export const Navbar = () => {
	return (
		<nav className='p-1 flex items-center justify-center fixed top-0 left-5 max-w-xl mx-auto gap-10'>
			<LangToggle />
		</nav>
	);
};
