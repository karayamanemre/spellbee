"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";
import LetterHive from "@/components/LetterHive";
import WordInput from "@/components/WordInput";
import Timer, { type TimerHandle } from "@/components/Timer";
import GameControls from "@/components/GameControls";
import { Button } from "@/components/ui/button";
import {
	evaluateSubmission,
	findFormableWords,
	GAME_RULES,
	type GameLanguage,
	sanitizeDictionary,
	selectRoundLetters,
	shuffleLetters,
} from "@/lib/gameEngine";

const copy = {
	en: {
		title: "Spell It!",
		start: "Start game",
		loadError: "The dictionary could not be loaded. Please try again.",
		timeUp: (score: number) => `Time's up! Your score: ${score}`,
		accepted: (word: string, points: number) => `${word.toUpperCase()} +${points}`,
		duplicate: "You already found that word.",
		tooShort: `Words must have at least ${GAME_RULES.minimumWordLength} letters.`,
		notFormable: "Use only the available letters, and only as often as shown.",
		notFound: "That word is not in this game's dictionary.",
		remaining: (remaining: number, total: number) =>
			`${remaining} of ${total} words remaining`,
	},
	tr: {
		title: "Kelimeyi Bul!",
		start: "Oyunu başlat",
		loadError: "Sözlük yüklenemedi. Lütfen tekrar deneyin.",
		timeUp: (score: number) => `Süre doldu! Puanınız: ${score}`,
		accepted: (word: string, points: number) =>
			`${word.toLocaleUpperCase("tr-TR")} +${points}`,
		duplicate: "Bu kelimeyi zaten buldunuz.",
		tooShort: `Kelimeler en az ${GAME_RULES.minimumWordLength} harfli olmalıdır.`,
		notFormable: "Yalnızca gösterilen harfleri, gösterildikleri sayıda kullanın.",
		notFound: "Bu kelime oyun sözlüğünde bulunmuyor.",
		remaining: (remaining: number, total: number) =>
			`${total} kelimeden ${remaining} tanesi kaldı`,
	},
} as const;

export default function SpellBeeGame({ language }: { language: GameLanguage }) {
	const text = copy[language];
	const [letters, setLetters] = useState<string[]>([]);
	const [dictionary, setDictionary] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [gameStarted, setGameStarted] = useState(false);
	const [score, setScore] = useState<number>(GAME_RULES.initialScore);
	const [word, setWord] = useState("");
	const [guessedWords, setGuessedWords] = useState<Set<string>>(new Set());
	const guessedWordsRef = useRef<Set<string>>(new Set());
	const [hints, setHints] = useState<string[]>([]);
	const [feedback, setFeedback] = useState("");
	const [isError, setIsError] = useState(false);
	const [scoreAnimation, setScoreAnimation] = useState(0);
	const [activeLetterIndex, setActiveLetterIndex] = useState<number | null>(null);
	const timerRef = useRef<TimerHandle>(null);

	const allRoundWords = useMemo(
		() => findFormableWords(letters, dictionary),
		[letters, dictionary]
	);
	const remainingRoundWords = useMemo(
		() => allRoundWords.filter((candidate) => !guessedWords.has(candidate)),
		[allRoundWords, guessedWords]
	);

	const chooseNewLetters = useCallback(() => {
		setLetters(selectRoundLetters(dictionary, guessedWordsRef.current));
		setHints([]);
		setWord("");
		setFeedback("");
	}, [dictionary]);

	const resetGame = useCallback(() => {
		setGameStarted(false);
		setLetters([]);
		setDictionary([]);
		setScore(GAME_RULES.initialScore);
		setWord("");
		setGuessedWords(new Set());
		guessedWordsRef.current = new Set();
		setHints([]);
		setFeedback("");
		setIsError(false);
		setScoreAnimation(0);
	}, []);

	const startGame = async () => {
		setIsLoading(true);
		setFeedback("");
		try {
			const response = await fetch("/api/dictionary");
			if (!response.ok) throw new Error("Dictionary request failed");
			const data = await response.json();
			const key = language === "tr" ? "turkishWords" : "englishWords";
			const words = sanitizeDictionary(data[key], language);
			const nextLetters = selectRoundLetters(words);
			setDictionary(words);
			setLetters(nextLetters);
			setScore(GAME_RULES.initialScore);
			setGuessedWords(new Set());
			guessedWordsRef.current = new Set();
			setHints([]);
			setWord("");
			setGameStarted(true);
		} catch {
			setFeedback(text.loadError);
		} finally {
			setIsLoading(false);
		}
	};

	const showError = useCallback((message: string) => {
		setFeedback(message);
		setIsError(true);
		window.setTimeout(() => setIsError(false), 600);
	}, []);

	const submitWord = useCallback((submittedWord: string) => {
		const result = evaluateSubmission({
			word: submittedWord,
			language,
			letters,
			dictionary,
			guessedWords: guessedWordsRef.current,
		});

		if (result.status !== "accepted") {
			const messages = {
				duplicate: text.duplicate,
				"too-short": text.tooShort,
				"not-formable": text.notFormable,
				"not-found": text.notFound,
			};
			showError(messages[result.status]);
			return;
		}

		const nextGuessed = new Set(guessedWordsRef.current).add(result.word);
		guessedWordsRef.current = nextGuessed;
		setGuessedWords(nextGuessed);
		setScore((current) => current + result.points);
		setScoreAnimation(result.points);
		timerRef.current?.addTime(GAME_RULES.secondsPerWord);
		setFeedback(text.accepted(result.word, result.points));
		window.setTimeout(() => setScoreAnimation(0), 1000);

		if (
			allRoundWords.length > 0 &&
			allRoundWords.every((candidate) => nextGuessed.has(candidate))
		) {
			setLetters(selectRoundLetters(dictionary, nextGuessed));
			setHints([]);
		}
	}, [allRoundWords, dictionary, language, letters, showError, text]);

	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!gameStarted || event.ctrlKey || event.metaKey || event.altKey) return;

			const pressed = event.key
				.normalize("NFC")
				.toLocaleLowerCase(language === "tr" ? "tr-TR" : "en-US");
			const index = letters.findIndex((letter) => letter === pressed);
			if (index >= 0) {
				setActiveLetterIndex(index);
				window.setTimeout(() => setActiveLetterIndex(null), 160);
			}

			const target = event.target as HTMLElement | null;
			if (
				target?.tagName === "INPUT" ||
				target?.tagName === "TEXTAREA" ||
				target?.isContentEditable
			) {
				return;
			}

			if (event.key === "Backspace") {
				event.preventDefault();
				setWord((current) => current.slice(0, -1));
				return;
			}

			if (event.key === "Enter" && word.length > 0) {
				event.preventDefault();
				submitWord(word);
				setWord("");
				return;
			}

			if (Array.from(pressed).length === 1 && /^[a-zçğıöşü]$/u.test(pressed)) {
				event.preventDefault();
				setWord((current) => current + pressed);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [gameStarted, language, letters, submitWord, word]);

	return (
		<main className='flex flex-col p-4 w-full max-h-dvh max-w-4xl mx-auto mt-8'>
			{isLoading && (
				<div className='flex items-center justify-center mx-auto mt-20' role='status'>
					<div className='three-body' aria-hidden='true'>
						<div className='three-body__dot' />
						<div className='three-body__dot' />
						<div className='three-body__dot' />
					</div>
				</div>
			)}

			{!gameStarted && !isLoading ? (
				<div className='flex flex-col gap-10 drop-shadow-2xl items-center justify-center h-[350px]'>
					<h1 className='font-semibold text-4xl text-cream'>{text.title}</h1>
					{feedback && <p className='text-red-400 font-semibold'>{feedback}</p>}
					<Button
						onClick={startGame}
						aria-label={text.start}
						className='bg-turqoise font-bold text-white rounded-lg h-20 w-20 sm:h-24 sm:w-32 flex items-center drop-shadow-2xl justify-center shadow-[0px_7px_2px_#4f766f] hover:scale-110 letter-flip hover:brightness-110'>
						<Play size={40} />
					</Button>
				</div>
			) : (
				!isLoading && (
					<div className='text-center flex flex-col gap-16 items-center w-full'>
						<div className='flex items-center justify-between mx-auto w-full'>
							<Timer
								ref={timerRef}
								initialTime={GAME_RULES.initialTime}
								onTimeUp={() => {
									setFeedback(text.timeUp(score));
									setGameStarted(false);
								}}
							/>
							<GameControls
								letters={letters}
								dictionary={dictionary}
								score={score}
								onShuffle={() => setLetters((current) => shuffleLetters(current))}
								onGetNewLetters={chooseNewLetters}
								guessedWords={guessedWords}
								setHints={setHints}
								hints={hints}
								setScore={setScore}
								onQuitGame={resetGame}
							/>
							<div className='flex items-center justify-center border-4 bg-cream rounded-md p-1 shadow-[0px_3px_1px] border-primary w-32 relative'>
								<p className='font-bold text-xl sm:text-3xl' aria-label={`${score} points`}>
									{score}
								</p>
								{scoreAnimation > 0 && (
									<p className='score-add-animation text-xl font-bold absolute top-2 -right-10'>
										+{scoreAnimation}
									</p>
								)}
							</div>
						</div>
						<LetterHive
							letters={letters}
							isError={isError}
							onLetterClick={(letter) => setWord((current) => current + letter)}
							activeLetterIndex={activeLetterIndex}
							setActiveLetterIndex={setActiveLetterIndex}
						/>
						<p className='-mt-12 font-semibold text-cream' aria-live='polite'>
							{text.remaining(remainingRoundWords.length, allRoundWords.length)}
						</p>
						<div className='w-full'>
							<WordInput onSubmit={submitWord} word={word} setWord={setWord} />
							<p
								aria-live='polite'
								className={`min-h-6 font-semibold ${isError ? "text-red-400" : "text-cream"}`}>
								{feedback}
							</p>
						</div>
					</div>
				)
			)}
		</main>
	);
}
