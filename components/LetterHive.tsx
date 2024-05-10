import React from "react";
import { Button } from "./ui/button";
import { ShuffleIcon } from "lucide-react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface LetterHiveProps {
	letters: string[];
	onShuffle: () => void;
}

const LetterHive: React.FC<LetterHiveProps> = ({ letters, onShuffle }) => {
	return (
		<div className='flex flex-col items-center my-10'>
			<div className='flex justify-center items-center flex-wrap mb-4 gap-1'>
				{letters.map((letter, index) => (
					<span
						key={index}
						className='text-base sm:text-xl font-bold bg-orange-500 rounded-full h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center shadow hover:scale-110'>
						{letter}
					</span>
				))}
			</div>
			<TooltipProvider>
				<Tooltip delayDuration={10}>
					<TooltipTrigger asChild>
						<Button
							variant='ghost'
							onClick={onShuffle}
							className='hover:bg-yellow-300 p-2 rounded-full hover:dark:text-black'>
							<ShuffleIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<span>Shuffle Letters</span>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	);
};

export default LetterHive;
