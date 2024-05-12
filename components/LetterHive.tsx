import React from "react";
import { Button } from "./ui/button";
import { ShuffleIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import useGetLanguage from "@/lib/useGetLanguage";

interface LetterHiveProps {
	letters: string[];
	onShuffle: () => void;
	isError: boolean;
}

const LetterHive: React.FC<LetterHiveProps> = ({
	letters,
	onShuffle,
	isError,
}) => {
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";

	const colors = [
		"bg-mustard shadow-[0px_8px_1px_hsl(33_44%_43%)]",
		"bg-turqoise shadow-[0px_8px_1px_hsl(169_20%_39%)]",
		"bg-brick shadow-[0px_8px_1px_hsl(358_44%_43%)]",
	];

	const randomizedLetters = letters.map((letter) => {
		const randomColor = colors[Math.floor(Math.random() * colors.length)];
		return { letter, color: randomColor };
	});

	return (
		<div className='flex flex-col items-center my-10 h-[100px]'>
			<div className='flex justify-center items-center flex-wrap mb-4 gap-[2px]'>
				{randomizedLetters.map((letter, index) => (
					<span
						key={index}
						className={`text-xl [text-shadow:_1px_1px_0px_#000000] drop-shadow-[1px_1px_0px_rgba(0,0,0,0.25)] sm:text-4xl font-bold text-white ${
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
							className='bg-cream p-2 mt-10 rounded-md shadow-[0px_3px_1px]'>
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
