"use client";
import LetterHive from "@/components/LetterHive";
import WordInput from "@/components/WordInput";
import { loadDictionary, selectRandomLetters } from "@/lib/dictionaryUtils";
import { useEffect, useState } from "react";

export default function EnPage() {
	const [letters, setLetters] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		loadDictionary("english")
			.then((words) => {
				const randomLetters = selectRandomLetters(words);
				setLetters(randomLetters);
				setIsLoading(false);
			})
			.catch((err) => {
				console.error("Error loading the dictionary:", err);
				setError("Failed to load words. Please try again later.");
				setIsLoading(false);
			});
	}, []);

	const handleWordSubmit = (word: string) => {
		console.log("Submitted word:", word);
	};

	return (
		<div className='flex flex-col items-center justify-center gap-10'>
			<h1>English Spelling Bee</h1>
			{isLoading && <p>Loading...</p>}
			{error && <p className='text-red-500'>{error}</p>}
			{!isLoading && !error && (
				<>
					<LetterHive letters={letters} />
					<WordInput onSubmit={handleWordSubmit} />
				</>
			)}
		</div>
	);
}
