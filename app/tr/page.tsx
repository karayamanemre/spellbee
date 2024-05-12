"use client";
import React, { useState } from "react";
import LetterHive from "@/components/LetterHive";
import WordInput from "@/components/WordInput";
import Timer from "@/components/Timer";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import {
	startGame,
	refreshLetters,
	validateWord,
	shuffleLetters,
} from "@/lib/gameService";

const TrPage = () => {
	const [letters, setLetters] = useState<string[]>([]);
	const [dictionary, setDictionary] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [score, setScore] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);
	const [additionalTime, setAdditionalTime] = useState(0);
	const [isError, setIsError] = useState(false);
	const [word, setWord] = useState("");

	const handleStartGame = async () => {
		setIsLoading(true);
		try {
			const { words, letters } = await startGame("turkish");
			setDictionary(words);
			setLetters(letters);
			setScore(0);
			setGameStarted(true);
			setError(null);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError("An unexpected error occurred");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleTimeUp = () => {
		setError(`Süre bitti. Skorunuz: ${score}`);
		setGameStarted(false);
	};

	const handleWordSubmit = (submittedWord: string) => {
		if (
			dictionary.includes(submittedWord.toLowerCase()) &&
			validateWord(submittedWord, letters)
		) {
			const newScore = score + submittedWord.length * 10;
			setScore(newScore);
			setAdditionalTime(15);
			setTimeout(() => setAdditionalTime(0), 100);
			setLetters(refreshLetters(dictionary));
			setError(null);
			setIsError(false);
		} else {
			setIsError(true);
			setTimeout(() => setIsError(false), 3000);
		}
	};

	const handleShuffleLetters = () => {
		setLetters(shuffleLetters(letters));
	};

	return (
		<div className='flex flex-col p-4 max-w-4xl mx-auto mt-8'>
			{isLoading && (
				<div className='flex items-center justify-center mx-auto mt-20'>
					<div className='three-body'>
						<div className='three-body__dot'></div>
						<div className='three-body__dot'></div>
						<div className='three-body__dot'></div>
					</div>
				</div>
			)}

			{error && !isLoading && (
				<p className='text-red-500 mx-auto text-xl sm:text-2xl mt-24 font-bold bg-cream p-2 border-black border-2 rounded-md shadow-[0px_3px_1px_#000000]'>
					{error}
				</p>
			)}

			{!gameStarted && !isLoading ? (
				<div className='flex drop-shadow-2xl items-center justify-center h-[250px] mt-10'>
					<Button
						onClick={handleStartGame}
						className='bg-turqoise font-bold text-white rounded-lg h-20 w-20 sm:h-24 sm:w-32 flex items-center drop-shadow-2xl justify-center shadow-[0px_7px_2px_#4f766f] hover:scale-110 letter-flip'>
						<Play size={40} />
					</Button>
				</div>
			) : (
				!isLoading && (
					<div className='text-center flex flex-col gap-20 items-center w-full'>
						<div className='flex items-center justify-between mx-auto w-full'>
							<Timer
								initialTime={60}
								onTimeUp={handleTimeUp}
								addTime={additionalTime}
							/>

							{score >= 50 && (
								<Button
									onClick={() => {
										setScore((prevScore) => prevScore - 50);
										setLetters(refreshLetters(dictionary));
									}}
									className='font-bold px-3 border border-black shadow-[0px_3px_1px] text-base sm:text-xl rounded-md bg-cream text-slate-900'>
									Yeni Harf Seti Al (-50)
								</Button>
							)}

							<div className='flex items-center justify-center border-4 bg-cream rounded-md rounded-tr-md p-1 shadow-[0px_3px_1px] border-primary w-32 relative'>
								<p className='font-bold text-xl sm:text-3xl'>{score}</p>
							</div>
						</div>
						<LetterHive
							letters={letters}
							onShuffle={handleShuffleLetters}
							isError={isError}
							onLetterClick={(letter: string) => setWord(word + letter)}
						/>
						<WordInput
							onSubmit={handleWordSubmit}
							word={word}
							setWord={setWord}
						/>
					</div>
				)
			)}
		</div>
	);
};

export default TrPage;
