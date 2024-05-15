"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { throttle } from "lodash";
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
import GameControls from "@/components/GameControls";
import { findFormableWords } from "@/lib/dictionaryUtils";

const EnPage = () => {
	const [letters, setLetters] = useState<string[]>([]);
	const [dictionary, setDictionary] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [score, setScore] = useState(20);
	const [gameStarted, setGameStarted] = useState(false);
	const [scoreAnimation, setScoreAnimation] = useState({
		show: false,
		points: 0,
	});
	const [additionalTime, setAdditionalTime] = useState(0);
	const [isError, setIsError] = useState(false);
	const [word, setWord] = useState("");
	const [guessedWords, setGuessedWords] = useState<Set<string>>(new Set());
	const [hints, setHints] = useState<string[]>([]);
	const [activeLetterIndex, setActiveLetterIndex] = useState<number | null>(
		null
	);

	const handleResetGame = () => {
		setGameStarted(false);
		setLetters([]);
		setDictionary([]);
		setScore(20);
		setError(null);
		setIsError(false);
		setWord("");
		setGuessedWords(new Set());
		setHints([]);
		setScoreAnimation({ show: false, points: 0 });
		setAdditionalTime(0);
	};

	const allWords = useMemo(() => {
		return findFormableWords(letters, dictionary);
	}, [letters, dictionary]);

	const handleNewLetters = useCallback(() => {
		const newLetters = refreshLetters(dictionary);
		setLetters(newLetters);
		setGuessedWords(new Set());
		setHints([]);
	}, [dictionary]);

	const handleStartGame = async () => {
		setIsLoading(true);
		try {
			const { words, letters } = await startGame("english");
			setDictionary(words);
			setLetters(letters);
			setScore(20);
			setGameStarted(true);
			setGuessedWords(new Set());
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
		setError(`Time's up! Your score: ${score}`);
		setGameStarted(false);
	};

	const handleWordSubmit = (submittedWord: string) => {
		const normalizedWord = submittedWord.toLowerCase();
		if (guessedWords.has(normalizedWord)) {
			setIsError(true);
			setTimeout(() => setIsError(false), 3000);
			return;
		}
		if (
			dictionary.includes(normalizedWord) &&
			validateWord(submittedWord, letters)
		) {
			const pointsEarned = submittedWord.length * 5;
			const newScore = score + pointsEarned;
			setScore(newScore);
			setScoreAnimation({ show: true, points: pointsEarned });
			setTimeout(() => setScoreAnimation({ show: false, points: 0 }), 1000);
			setAdditionalTime(10);
			setTimeout(() => setAdditionalTime(0), 100);
			guessedWords.add(submittedWord.toLowerCase());
			setGuessedWords(new Set(guessedWords));
			if (!hints.includes(submittedWord.toLowerCase())) {
				setHints([...hints, submittedWord.toLowerCase()]);
			}
			setError(null);
			setIsError(false);
			const allWords = findFormableWords(letters, dictionary);
			if (allWords.every((word) => guessedWords.has(word))) {
				handleNewLetters();
			}
		} else {
			setIsError(true);
			setTimeout(() => setIsError(false), 3000);
		}
	};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleShuffleLetters = useCallback(
		throttle(() => {
			setLetters(shuffleLetters(letters));
		}, 300),
		[letters]
	);

	useEffect(() => {
		if (allWords.length && allWords.every((word) => guessedWords.has(word))) {
			handleNewLetters();
		}
	}, [allWords, guessedWords, handleNewLetters]);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			const key = event.key.toUpperCase();
			const index = letters.findIndex((l) => l.toUpperCase() === key);
			if (index !== -1) {
				setActiveLetterIndex(index);
				setTimeout(() => setActiveLetterIndex(null), 200); // Reset after a short delay
			}
		};
		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [letters]);

	return (
		<div className='flex flex-col p-4 w-full max-h-dvh max-w-4xl mx-auto mt-8'>
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
				<div className='flex flex-col gap-10 drop-shadow-2xl items-center justify-center h-[350px]'>
					<h1 className='font-semibold text-4xl text-cream'>Spell It!</h1>
					<Button
						onClick={handleStartGame}
						className='bg-turqoise font-bold text-white rounded-lg h-20 w-20 sm:h-24 sm:w-32 flex items-center drop-shadow-2xl justify-center shadow-[0px_7px_2px_#4f766f] hover:scale-110 letter-flip hover:brightness-110'>
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

							<GameControls
								letters={letters}
								dictionary={dictionary}
								score={score}
								onShuffle={handleShuffleLetters}
								onGetNewLetters={handleNewLetters}
								guessedWords={guessedWords}
								setHints={setHints}
								hints={hints}
								setScore={setScore}
								onQuitGame={handleResetGame}
							/>

							<div className='flex items-center justify-center border-4 bg-cream rounded-md rounded-tr-md p-1 shadow-[0px_3px_1px] border-primary w-32 relative'>
								<p className='font-bold text-xl sm:text-3xl'>{score}</p>
								{scoreAnimation.show && (
									<p className='score-add-animation ml-[88px] text-xl font-bold absolute top-2 -right-10'>
										+{scoreAnimation.points}
									</p>
								)}
							</div>
						</div>
						<LetterHive
							letters={letters}
							isError={isError}
							onLetterClick={(letter: string) => setWord(word + letter)}
							activeLetterIndex={activeLetterIndex}
							setActiveLetterIndex={setActiveLetterIndex}
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

export default EnPage;
