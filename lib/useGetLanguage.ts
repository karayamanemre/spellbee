import { usePathname } from "next/navigation";

/**
 * A custom hook that extracts the language code from the pathname.
 * Assumes that the language code is the first segment of the pathname.
 */
function useGetLanguage() {
	const pathname = usePathname();
	const languageCode = pathname.split("/")[1];

	return languageCode;
}

export default useGetLanguage;
