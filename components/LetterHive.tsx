import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Lightbulb, ShuffleIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import useGetLanguage from "@/lib/useGetLanguage";
import { findFormableWords } from "@/lib/dictionaryUtils";

interface LetterHiveProps {
	letters: string[];
	onShuffle: () => void;
	isError: boolean;
	onLetterClick: (letter: string) => void;
	dictionary: string[];
}

const LetterHive: React.FC<LetterHiveProps> = ({
	letters,
	onShuffle,
	isError,
	onLetterClick,
	dictionary,
}) => {
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";
	const [hints, setHints] = useState<string[]>([]);
	const [showHints, setShowHints] = useState(false);

	const handleShowHints = () => {
		const formableWords = findFormableWords(letters, dictionary);
		setHints(formableWords);
		setShowHints(true);
	};

	useEffect(() => {
		setHints([]);
		setShowHints(false);
	}, [letters]);

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
		<div className='flex flex-col items-center h-[300px]'>
			<TooltipProvider>
				<Tooltip delayDuration={10}>
					<TooltipTrigger>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									onClick={handleShowHints}
									variant='ghost'
									className='bg-cream p-2 my-10 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black'>
									<Lightbulb />
								</Button>
							</PopoverTrigger>
							<PopoverContent>
								{showHints && (
									<div>
										<p>
											{isTurkish
												? "Bulabileceğiniz kelimeler:"
												: "Words you can form:"}
										</p>
										{hints.map((hint, index) => (
											<div key={index}>{hint}</div>
										))}
									</div>
								)}
							</PopoverContent>
						</Popover>
					</TooltipTrigger>
					<TooltipContent>
						<p className='text-center'>
							{isTurkish ? "İpucu göster" : "Show hints"}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<div className='flex justify-center items-center flex-wrap mb-4 gap-[2px]'>
				{randomizedLetters.map((letter, index) => (
					<span
						key={index}
						onClick={() => onLetterClick(letter.letter)}
						className={`text-xl cursor-cell [text-shadow:_1px_1px_0px_#000000] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.25)] sm:text-4xl font-bold text-white ${
							letter.color
						} rounded-lg h-12 w-12 sm:h-20 sm:w-20 flex items-center justify-center hover:scale-110 letter-flip ${
							isError ? "shake error-bg" : ""
						}`}>
						{letter.letter}
					</span>
				))}
			</div>
			<TooltipProvider>
				<Tooltip delayDuration={10}>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={onShuffle}
							className='bg-cream p-2 mt-10 rounded-md shadow-[0px_3px_1px] hover:bg-mustard'>
							<ShuffleIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<p className='text-center'>
							{isTurkish ? "Harfleri karıştır" : "Shuffle the letters"}
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default LetterHive;
