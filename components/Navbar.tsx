import Info from "./Info";
import { LangToggle } from "./LangToggle";

export const Navbar = () => {
	return (
		<nav className='p-1 flex items-center w-full justify-center fixed top-0 px-2 mx-auto gap-40'>
			<LangToggle />
			<Info />
		</nav>
	);
};
