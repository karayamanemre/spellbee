import React, { useState, useEffect } from "react";
import useGetLanguage from "@/lib/useGetLanguage";

interface LetterHiveProps {
	letters: string[];
	isError: boolean;
	onLetterClick: (letter: string) => void;
	activeLetterIndex: number | null;
	setActiveLetterIndex: (index: number | null) => void; // Ensure this is a function
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

	const [randomizedLetters, setRandomizedLetters] = useState<StyledLetter[]>(
		[]
	);

	const handleTouchStart = (
		e: React.TouchEvent<HTMLSpanElement>,
		index: number
	) => {
		e.preventDefault(); // Prevent default touch behavior
		setActiveLetterIndex(index);
		onLetterClick(randomizedLetters[index].letter);
	};

	const handleTouchEnd = (e: React.TouchEvent<HTMLSpanElement>) => {
		e.preventDefault(); // Ensure touch end doesn't trigger default behavior
		setActiveLetterIndex(null);
	};

	useEffect(() => {
		const newStyledLetters = letters.map((letter, index) => ({
			letter,
			color: colors[Math.floor(Math.random() * colors.length)],
			index,
		}));
		setRandomizedLetters(newStyledLetters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [letters]);

	return (
		<div className='flex justify-center items-center flex-wrap mb-4 gap-[2px]'>
			{randomizedLetters.map((styledLetter) => (
				<span
					key={styledLetter.index}
					onTouchStart={(e) => handleTouchStart(e, styledLetter.index)}
					onTouchEnd={handleTouchEnd}
					onMouseDown={() => {
						onLetterClick(styledLetter.letter);
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
				</span>
			))}
		</div>
	);
};

export default LetterHive;
