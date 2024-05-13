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
	} while (!canFormAtLeastTwoWords(selectedLetters, words, 3));

	return selectedLetters;
}

function canFormAtLeastTwoWords(
	letters: string[],
	dictionary: WordList,
	minimumWords: number
): boolean {
	const letterCounts = letters.reduce((counts, letter) => {
		counts[letter] = (counts[letter] || 0) + 1;
		return counts;
	}, {} as Record<string, number>);

	let matchingWordsCount = 0;

	for (const word of dictionary) {
		const wordCounts = Array.from(word).reduce((counts, char) => {
			counts[char] = (counts[char] || 0) + 1;
			return counts;
		}, {} as Record<string, number>);

		if (
			Object.keys(wordCounts).every(
				(char) => wordCounts[char] <= (letterCounts[char] || 0)
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

function findFormableWords(letters: string[], dictionary: WordList): string[] {
	const letterCounts = letters.reduce((counts, letter) => {
		counts[letter] = (counts[letter] || 0) + 1;
		return counts;
	}, {} as Record<string, number>);

	const formableWords = [];

	for (const word of dictionary) {
		const wordCounts = Array.from(word).reduce((counts, char) => {
			counts[char] = (counts[char] || 0) + 1;
			return counts;
		}, {} as Record<string, number>);

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
