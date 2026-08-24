import React from "react";
import useGetLanguage from "@/lib/useGetLanguage";

interface LetterHiveProps {
	letters: string[];
	isError: boolean;
	onLetterClick: (letter: string) => void;
	activeLetterIndex: number | null;
	setActiveLetterIndex: (index: number | null) => void;
}

interface StyledLetter {
	letter: string;
	color: string;
	index: number;
}

const LetterHive: React.FC<LetterHiveProps> = ({
	letters,
	isError,
	onLetterClick,
	activeLetterIndex,
	setActiveLetterIndex,
}) => {
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";

	const colors = [
		"bg-mustard shadow-[0px_8px_1px_hsl(33_44%_43%)]",
		"bg-turqoise shadow-[0px_8px_1px_hsl(169_20%_39%)]",
		"bg-brick shadow-[0px_8px_1px_hsl(358_44%_43%)]",
	];

	const styledLetters: StyledLetter[] = letters.map((letter, index) => ({
			letter,
			color: colors[index % colors.length],
			index,
		}));

	return (
		<div className='flex justify-center items-center flex-wrap mb-4 gap-[2px]'>
			{styledLetters.map((styledLetter) => (
				<button
					type='button'
					aria-label={`${isTurkish ? "Harf" : "Letter"} ${styledLetter.letter}`}
					key={styledLetter.index}
					onClick={() => onLetterClick(styledLetter.letter)}
					onMouseDown={() => {
						setActiveLetterIndex(styledLetter.index);
					}}
					onMouseUp={() => setActiveLetterIndex(null)}
					onMouseLeave={() => setActiveLetterIndex(null)}
					className={`text-xl cursor-cell hover:bg-gray-600 hover:shadow-[0px_8px_1px_hsl(0_0%_22%)] [text-shadow:_1px_1px_0px_#000000] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.25)] sm:text-4xl font-bold text-white select-none ${
						styledLetter.color
					} rounded-lg h-12 w-12 sm:h-20 sm:w-20 flex items-center justify-center ${
						isError ? "shake error-bg" : ""
					} ${activeLetterIndex === styledLetter.index ? "pressed" : ""}`}>
					{isTurkish
						? styledLetter.letter.toLocaleUpperCase("tr-TR")
						: styledLetter.letter.toUpperCase()}
				</button>
			))}
		</div>
	);
};

export default LetterHive;
