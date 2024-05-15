import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Lightbulb, PowerOff, RefreshCcw, ShuffleIcon } from "lucide-react";
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
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { findFormableWords } from "@/lib/dictionaryUtils";
import useGetLanguage from "@/lib/useGetLanguage";
import { ExitIcon } from "@radix-ui/react-icons";

interface GameControlsProps {
	letters: string[];
	dictionary: string[];
	score: number;
	onShuffle: () => void;
	onGetNewLetters: () => void;
	guessedWords: Set<string>;
	setHints: (hints: string[]) => void;
	hints: string[];
	setScore: (score: number) => void;
	onQuitGame: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
	letters,
	dictionary,
	score,
	onShuffle,
	onGetNewLetters,
	guessedWords,
	setHints,
	hints,
	setScore,
	onQuitGame,
}) => {
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";
	const [showHints, setShowHints] = useState(false);

	const handleShowHints = () => {
		if (score >= 20) {
			const formableWords = findFormableWords(letters, dictionary).filter(
				(word) => !hints.includes(word)
			);
			if (formableWords.length > 0) {
				const randomIndex = Math.floor(Math.random() * formableWords.length);
				const newHint = formableWords[randomIndex];
				setHints([...hints, newHint]);
			}
			setShowHints(true);
			setScore(score - 20);
		}
	};

	useEffect(() => {
		setHints([]);
		setShowHints(false);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [letters]);

	return (
		<div className='flex items-center justify-around space-x-1 lg:space-x-4'>
			<TooltipProvider>
				<Tooltip delayDuration={10}>
					<TooltipTrigger asChild>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									disabled={score < 20}
									onClick={() => {
										handleShowHints();
										setScore(score - 20);
									}}
									className='bg-cream p-2 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black disabled:cursor-default'>
									<Lightbulb />
								</Button>
							</PopoverTrigger>
							<PopoverContent className='bg-cream p-2 rounded-md shadow-[0px_3px_1px] w-max'>
								{showHints &&
									hints.map((hint, index) => (
										<div
											key={index}
											className='flex items-center'>
											<p className='mr-2'>{hint}</p>
											{guessedWords.has(hint) && (
												<span className='text-green-500'>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														fill='none'
														viewBox='0 0 24 24'
														strokeWidth={2.5}
														stroke='currentColor'
														className='w-6 h-6'>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															d='M4.75 12.25l5 5L19.25 7.75'
														/>
													</svg>
												</span>
											)}
										</div>
									))}
							</PopoverContent>
						</Popover>
					</TooltipTrigger>
					<TooltipContent className='bg-cream text-black p-2'>
						<p>{isTurkish ? "İpucu" : "Hint"} (-20)</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip delayDuration={10}>
					<TooltipTrigger asChild>
						<Button
							disabled={score < 2}
							onClick={() => {
								onShuffle();
								setScore(score - 2);
							}}
							className='bg-cream p-2 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black'>
							<ShuffleIcon />
						</Button>
					</TooltipTrigger>
					<TooltipContent className='bg-cream text-black p-2'>
						<p>{isTurkish ? "Karıştır" : "Shuffle"} (-2)</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<TooltipProvider>
				<Tooltip delayDuration={10}>
					<TooltipTrigger asChild>
						<Button
							disabled={score < 50}
							onClick={() => {
								onGetNewLetters();
								setScore(score - 50);
							}}
							className='bg-cream p-2 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black'>
							<RefreshCcw />
						</Button>
					</TooltipTrigger>
					<TooltipContent className='bg-cream text-black p-2'>
						<p>{isTurkish ? "Yeni Harfler" : "New Letters"} (-50)</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>

			<AlertDialog>
				<AlertDialogTrigger asChild>
					<Button
						variant='ghost'
						className='bg-cream p-2 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black'>
						<ExitIcon />
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{isTurkish ? "Oyundan Çık" : "Quit Game"}
						</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>
							{isTurkish ? "İptal" : "Cancel"}
						</AlertDialogCancel>
						<AlertDialogAction onClick={onQuitGame}>
							{isTurkish ? "Çık" : "Quit"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default GameControls;
