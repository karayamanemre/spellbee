type WordList = string[];

async function loadDictionary(language: string): Promise<WordList> {
	const response = await fetch(`/api/dictionary`);
	if (!response.ok) {
		throw new Error("Failed to load dictionary");
	}
	const data = await response.json();
	return data[language + "Words"] || [];
}

function shuffleArray(array: string[]): string[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

function selectSevenRandomLetters(words: WordList): string[] {
	const allLetters = words
		.join("")
		.replace(/[^a-zşğüöçı]/gi, "")
		.split("");
	let selectedLetters: string[] = [];
	let attempts = 0;

	do {
		shuffleArray(allLetters);
		selectedLetters = allLetters.slice(0, 7);
		attempts++;
		if (attempts > 100) break;
	} while (
		!canFormAtLeastTwoWords(selectedLetters, words, 3) ||
		!hasLongerWords(selectedLetters, words)
	);

	return selectedLetters;
}

function hasLongerWords(letters: string[], dictionary: WordList): boolean {
	return dictionary.some((word) => {
		if (word.length < 5) return false;
		const wordLetterCounts = getLetterCounts(word);
		return Object.keys(wordLetterCounts).every(
			(char) =>
				wordLetterCounts[char] <= (getLetterCounts(letters.join(""))[char] || 0)
		);
	});
}

function canFormAtLeastTwoWords(
	letters: string[],
	dictionary: WordList,
	minimumWords: number
): boolean {
	let matchingWordsCount = 0;

	for (const word of dictionary) {
		const wordLetterCounts = getLetterCounts(word);
		if (
			Object.keys(wordLetterCounts).every(
				(char) =>
					wordLetterCounts[char] <=
					(getLetterCounts(letters.join(""))[char] || 0)
			)
		) {
			matchingWordsCount++;
			if (matchingWordsCount >= minimumWords) {
				return true;
			}
		}
	}
	return false;
}

function getLetterCounts(word: string): Record<string, number> {
	return Array.from(word).reduce((counts, char) => {
		counts[char] = (counts[char] || 0) + 1;
		return counts;
	}, {} as Record<string, number>);
}

function findFormableWords(letters: string[], dictionary: WordList): string[] {
	const letterCounts = getLetterCounts(letters.join(""));
	const formableWords = [];

	for (const word of dictionary) {
		const wordCounts = getLetterCounts(word);
		if (
			Object.keys(wordCounts).every(
				(char) => wordCounts[char] <= (letterCounts[char] || 0)
			)
		) {
			formableWords.push(word);
		}
	}

	return formableWords;
}

export {
	loadDictionary,
	selectSevenRandomLetters,
	shuffleArray,
	findFormableWords,
};
