import Info from "./Info";
import { LangToggle } from "./LangToggle";

export const Navbar = () => {
	return (
		<nav className='p-1 flex items-center max-w-4xl w-full justify-between fixed top-0 px-4 mx-auto'>
			<LangToggle />
			<Info />
		</nav>
	);
};
