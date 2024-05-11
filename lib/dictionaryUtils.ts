// dictionaryUtils.ts
type WordList = string[];

async function loadDictionary(language: string): Promise<WordList> {
	const response = await fetch(`https://emrekarayaman.me/dictionary.json`);
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
		.toUpperCase()
		.replace(/[^A-Z]/gi, "")
		.split("");
	let selectedLetters: string[] = [];
	let attempts = 0;

	do {
		shuffleArray(allLetters);
		selectedLetters = allLetters.slice(0, 7);
		attempts++;
		// Prevent infinite loops
		if (attempts > 100) break;
	} while (!canFormWords(selectedLetters, words));

	return selectedLetters;
}

function canFormWords(letters: string[], dictionary: WordList): boolean {
	const letterCounts = letters.reduce((counts, letter) => {
		counts[letter] = (counts[letter] || 0) + 1;
		return counts;
	}, {} as Record<string, number>);

	return dictionary.some((word) => {
		const wordCounts = Array.from(word.toUpperCase()).reduce((counts, char) => {
			counts[char] = (counts[char] || 0) + 1;
			return counts;
		}, {} as Record<string, number>);

		return Object.keys(wordCounts).every(
			(char) => wordCounts[char] <= (letterCounts[char] || 0)
		);
	});
}

export { loadDictionary, selectSevenRandomLetters, shuffleArray };
