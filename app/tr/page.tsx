"use client";
import React, { useState } from "react";
import LetterHive from "@/components/LetterHive";
import WordInput from "@/components/WordInput";
import Timer from "@/components/Timer";
import {
	loadDictionary,
	selectSevenRandomLetters,
} from "@/lib/dictionaryUtils";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const TrPage = () => {
	const [letters, setLetters] = useState<string[]>([]);
	const [dictionary, setDictionary] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [score, setScore] = useState(0);
	const [gameStarted, setGameStarted] = useState(false);
	const [additionalTime, setAdditionalTime] = useState(0);
	const [animateTimeAdd, setAnimateTimeAdd] = useState(false);
	const [isError, setIsError] = useState(false);

	const startGame = async () => {
		setIsLoading(true);
		try {
			const words = await loadDictionary("turkish");
			setDictionary(words);
			const letters = selectSevenRandomLetters(words);
			setLetters(letters);
			setScore(0);
			setGameStarted(true);
			setError(null);
		} catch (error) {
			console.error("Error loading the dictionary:", error);
			setError("Something went wrong. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	const refreshLetters = (words: string[]) => {
		const lettersFromWord = selectSevenRandomLetters(words);
		setLetters(lettersFromWord);
	};

	const handleTimeUp = () => {
		setError(`Zaman doldu. Skorunuz: ${score}`);
		setGameStarted(false);
	};

	const getNewLetters = () => {
		if (score >= 50) {
			setScore((prevScore) => prevScore - 50);
			refreshLetters(dictionary);
		} else {
			setError("Yeni harfler almak için yeterli puanınız yok.");
			setTimeout(() => setError(null), 3000);
		}
	};

	const handleWordSubmit = (word: string) => {
		if (
			dictionary.includes(word.toLowerCase()) &&
			validateWord(word, letters)
		) {
			setScore((prevScore) => prevScore + word.length * 10);
			setAdditionalTime(15);
			setAnimateTimeAdd(true);
			setTimeout(() => {
				setAdditionalTime(0);
				setAnimateTimeAdd(false);
			}, 100);
			refreshLetters(dictionary);
			setError(null);
			setIsError(false);
		} else {
			setIsError(true);
			setTimeout(() => {
				setError(null);
				setIsError(false);
			}, 3000);
		}
	};

	const validateWord = (word: string, availableLetters: string[]): boolean => {
		let tempLetters = availableLetters.slice();
		for (let char of word.toUpperCase()) {
			const index = tempLetters.indexOf(char);
			if (index === -1) {
				return false;
			}
			tempLetters.splice(index, 1);
		}
		setError(null);
		return true;
	};

	const shuffleLetters = () => {
		setLetters((prevLetters) => {
			const shuffled = [...prevLetters];
			for (let i = shuffled.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
			}
			return shuffled;
		});
	};

	return (
		<div className='flex flex-col p-4 max-w-4xl mx-auto'>
			{isLoading && (
				<div className='flex items-center justify-center mx-auto mt-20'>
					<div className='three-body'>
						<div className='three-body__dot'></div>
						<div className='three-body__dot'></div>
						<div className='three-body__dot'></div>
					</div>
				</div>
			)}
			<div className='h-10 mx-auto text-lg'>
				{error && !isLoading && (
					<p className='text-red-500 mx-auto mt-24 font-bold bg-cream p-1 rounded-md'>
						{error}
					</p>
				)}
			</div>
			{!gameStarted && !isLoading ? (
				<div className='flex items-center justify-center h-[250px] mt-10'>
					<Button
						onClick={startGame}
						className='bg-turqoise font-bold text-white rounded-lg h-20 w-20 sm:h-24 sm:w-32 flex items-center justify-center shadow-[0px_7px_2px_#4f766f] hover:scale-110 letter-flip'>
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
									onClick={getNewLetters}
									className='font-bold px-3 border border-black shadow-[0px_3px_1px] text-base sm:text-xl rounded-md bg-cream text-slate-900'>
									Yeni Harf Seti Al (-50)
								</Button>
							)}

							<div className='flex items-center justify-center border-2 bg-cream rounded-md rounded-tr-md p-1 shadow-lg border-primary w-32 relative'>
								<p className='font-bold text-3xl'>{score}</p>
							</div>
						</div>
						<LetterHive
							letters={letters}
							onShuffle={shuffleLetters}
							isError={isError}
						/>
						<WordInput onSubmit={handleWordSubmit} />
					</div>
				)
			)}
		</div>
	);
};

export default TrPage;
