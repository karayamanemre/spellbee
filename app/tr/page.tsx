"use client";
import React, { useState } from "react";
import LetterHive from "@/components/LetterHive";
import WordInput from "@/components/WordInput";
import Timer from "@/components/Timer";
import { loadDictionary, selectLettersFromWord } from "@/lib/dictionaryUtils";
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

	const startGame = () => {
		setIsLoading(true);
		setTimeout(() => {
			loadDictionary("turkish")
				.then((words) => {
					setDictionary(words);
					refreshLetters(words);
					setScore(0);
					setGameStarted(true);
					setError(null);
				})
				.catch((err) => {
					console.error("Error loading the dictionary:", err);
					setError("Bir şeyler ters gitti. Lütfen daha sonra tekrar deneyin.");
				})
				.finally(() => setIsLoading(false));
		}, 1500);
	};

	const refreshLetters = (words: string[]) => {
		const lettersFromWord = selectLettersFromWord(words);
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
		} else {
			setError(
				`${word} kelimesi geçersiz veya harflerle uyuşmuyor. Tekrar deneyin.`
			);
			setTimeout(() => setError(null), 3000);
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
		<div className='flex flex-col p-4 max-w-2xl mx-auto'>
			{isLoading && (
				<div className='flex items-center justify-center mx-auto mt-20'>
					<div className='three-body'>
						<div className='three-body__dot'></div>
						<div className='three-body__dot'></div>
						<div className='three-body__dot'></div>
					</div>
				</div>
			)}
			<div className='h-10 mx-auto'>
				{error && !isLoading && (
					<p className='text-red-500 mx-auto mb-4 font-bold'>{error}</p>
				)}
			</div>
			{!gameStarted && !isLoading ? (
				<Button
					variant='ghost'
					onClick={startGame}
					className='hover:bg-yellow-300 p-2 rounded-md hover:dark:text-black mt-10 shadow-lg border-2 border-black dark:border-white text-lg mx-auto'>
					Başla <Play />
				</Button>
			) : (
				!isLoading && (
					<div className='border-2 rounded-md shadow text-center'>
						<div className='flex items-center justify-between mx-auto'>
							<Timer
								initialTime={60}
								onTimeUp={handleTimeUp}
								addTime={additionalTime}
							/>

							{score >= 50 && (
								<Button
									variant='ghost'
									onClick={getNewLetters}
									className='font-bold px-4 '>
									Yeni Harf Seti Al (-50)
								</Button>
							)}

							<div className='flex items-center justify-between border-l-2 border-b-2 bg-yellow-400 rounded-bl-md rounded-tr-md p-1 shadow-lg border-primary w-32 relative '>
								Puan: <strong>{score}</strong>
							</div>
						</div>

						<LetterHive
							letters={letters}
							onShuffle={shuffleLetters}
						/>

						<WordInput onSubmit={handleWordSubmit} />
					</div>
				)
			)}
		</div>
	);
};

export default TrPage;
