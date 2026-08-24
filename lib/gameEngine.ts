export type GameLanguage = "en" | "tr";

export const GAME_RULES = {
	initialScore: 20,
	initialTime: 60,
	minimumWordLength: 3,
	pointsPerLetter: 5,
	secondsPerWord: 10,
	hintCost: 20,
	shuffleCost: 2,
	newLettersCost: 50,
	lettersPerRound: 7,
	minimumWordsPerRound: 3,
} as const;

const localeByLanguage: Record<GameLanguage, string> = {
	en: "en-US",
	tr: "tr-TR",
};

export function normalizeWord(word: string, language: GameLanguage): string {
	return word
		.trim()
		.normalize("NFC")
		.toLocaleLowerCase(localeByLanguage[language]);
}

export function getLetterCounts(value: string): Map<string, number> {
	const counts = new Map<string, number>();
	for (const character of Array.from(value)) {
		counts.set(character, (counts.get(character) ?? 0) + 1);
	}
	return counts;
}

export function canFormWord(word: string, letters: string[]): boolean {
	const available = getLetterCounts(letters.join(""));
	for (const [character, count] of Array.from(getLetterCounts(word).entries())) {
		if (count > (available.get(character) ?? 0)) return false;
	}
	return true;
}

export function sanitizeDictionary(
	words: unknown,
	language: GameLanguage
): string[] {
	if (!Array.isArray(words)) return [];

	return Array.from(
		new Set(
			words
				.filter((word): word is string => typeof word === "string")
				.map((word) => normalizeWord(word, language))
				.filter(
					(word) =>
						Array.from(word).length >= GAME_RULES.minimumWordLength &&
						/^[a-zçğıöşü]+$/u.test(word)
				)
		)
	);
}

export function findFormableWords(
	letters: string[],
	dictionary: string[]
): string[] {
	return dictionary.filter(
		(word) =>
			Array.from(word).length >= GAME_RULES.minimumWordLength &&
			canFormWord(word, letters)
	);
}

export function shuffleLetters(letters: string[]): string[] {
	const shuffled = [...letters];
	for (let index = shuffled.length - 1; index > 0; index--) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[randomIndex]] = [
			shuffled[randomIndex],
			shuffled[index],
		];
	}
	return shuffled;
}

export function selectRoundLetters(
	dictionary: string[],
	guessedWords: ReadonlySet<string> = new Set()
): string[] {
	const baseWords = dictionary.filter(
		(word) => Array.from(word).length === GAME_RULES.lettersPerRound
	);
	if (baseWords.length === 0) {
		throw new Error("The dictionary has no seven-letter words.");
	}

	const playable = baseWords.filter((word) => {
		const words = findFormableWords(Array.from(word), dictionary);
		return (
			words.length >= GAME_RULES.minimumWordsPerRound &&
			words.some((candidate) => !guessedWords.has(candidate))
		);
	});
	const candidates = playable.length > 0 ? playable : baseWords;
	const selected = candidates[Math.floor(Math.random() * candidates.length)];
	return shuffleLetters(Array.from(selected));
}

export type SubmissionResult =
	| { status: "accepted"; word: string; points: number }
	| { status: "duplicate" | "too-short" | "not-formable" | "not-found"; word: string; points: 0 };

export function evaluateSubmission({
	word,
	language,
	letters,
	dictionary,
	guessedWords,
}: {
	word: string;
	language: GameLanguage;
	letters: string[];
	dictionary: readonly string[];
	guessedWords: ReadonlySet<string>;
}): SubmissionResult {
	const normalized = normalizeWord(word, language);
	if (Array.from(normalized).length < GAME_RULES.minimumWordLength) {
		return { status: "too-short", word: normalized, points: 0 };
	}
	if (guessedWords.has(normalized)) {
		return { status: "duplicate", word: normalized, points: 0 };
	}
	if (!canFormWord(normalized, letters)) {
		return { status: "not-formable", word: normalized, points: 0 };
	}
	if (!dictionary.includes(normalized)) {
		return { status: "not-found", word: normalized, points: 0 };
	}
	return {
		status: "accepted",
		word: normalized,
		points: Array.from(normalized).length * GAME_RULES.pointsPerLetter,
	};
}
