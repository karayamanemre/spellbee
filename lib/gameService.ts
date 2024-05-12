import {
	loadDictionary,
	selectSevenRandomLetters,
} from "@/lib/dictionaryUtils";

export const startGame = async (language: string) => {
	try {
		const words = await loadDictionary(language);
		const letters = selectSevenRandomLetters(words);
		return { words, letters };
	} catch (error) {
		console.error("Error loading the dictionary:", error);
		throw new Error("Something went wrong. Please try again later.");
	}
};

export const refreshLetters = (words: string[]) => {
	return selectSevenRandomLetters(words);
};

export const validateWord = (word: string, availableLetters: string[]) => {
	let tempLetters = availableLetters.slice();
	for (let char of word.toUpperCase()) {
		if (!tempLetters.includes(char)) {
			return false;
		}
		tempLetters.splice(tempLetters.indexOf(char), 1);
	}
	return true;
};

export const shuffleLetters = (letters: string[]) => {
	return [...letters].sort(() => Math.random() - 0.5);
};
