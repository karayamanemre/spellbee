import Info from "./Info";
import { LangToggle } from "./LangToggle";

export const Navbar = () => {
	return (
		<nav className='p-1 lg:px-40 flex items-center w-full justify-between fixed top-0 px-2 mx-auto gap-10'>
			<LangToggle />
			<Info />
		</nav>
	);
};
