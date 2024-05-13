import useGetLanguage from "@/lib/useGetLanguage";
import React, { useState, useEffect } from "react";

interface LetterHiveProps {
	letters: string[];
	isError: boolean;
	onLetterClick: (letter: string) => void;
}

const LetterHive: React.FC<LetterHiveProps> = ({
	letters,
	isError,
	onLetterClick,
}) => {
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";

	const colors = [
		"bg-mustard shadow-[0px_8px_1px_hsl(33_44%_43%)]",
		"bg-turqoise shadow-[0px_8px_1px_hsl(169_20%_39%)]",
		"bg-brick shadow-[0px_8px_1px_hsl(358_44%_43%)]",
	];

	const [randomizedLetters, setRandomizedLetters] = useState(() => {
		return letters.map((letter) => {
			const randomColor = colors[Math.floor(Math.random() * colors.length)];
			return { letter, color: randomColor };
		});
	});

	useEffect(() => {
		setRandomizedLetters(
			letters.map((letter) => {
				const randomColor = colors[Math.floor(Math.random() * colors.length)];
				return { letter, color: randomColor };
			})
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [letters]);

	return (
		<div className='flex justify-center items-center flex-wrap mb-4 gap-[2px]'>
			{randomizedLetters.map((letter, index) => (
				<span
					key={index}
					onClick={() => onLetterClick(letter.letter)}
					className={`text-xl cursor-cell hover:bg-gray-600 hover:shadow-[0px_8px_1px_hsl(0_0%_22%)] [text-shadow:_1px_1px_0px_#000000] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.25)] sm:text-4xl font-bold text-white ${
						letter.color
					} rounded-lg h-12 w-12 sm:h-20 sm:w-20 flex items-center justify-center hover:scale-110  letter-flip ${
						isError ? "shake error-bg" : ""
					}`}>
					{isTurkish
						? letter.letter.toLocaleUpperCase("tr-TR")
						: letter.letter.toUpperCase()}
				</span>
			))}
		</div>
	);
};

export default LetterHive;
