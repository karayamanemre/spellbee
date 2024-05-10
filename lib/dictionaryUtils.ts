async function loadDictionary(language: string): Promise<string[]> {
	const response = await fetch(`/api/dictionary`);
	if (!response.ok) {
		throw new Error("Failed to load dictionary");
	}
	const data = await response.json();
	switch (language) {
		case "english":
			return data.englishWords;
		case "turkish":
			return data.turkishWords;
		default:
			throw new Error("Invalid language specified");
	}
}

function selectLettersFromWord(words: string[]): string[] {
	const baseWord = words[Math.floor(Math.random() * words.length)];
	return shuffleArray(baseWord.toUpperCase().split(""));
}

function shuffleArray(array: string[]): string[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

export { loadDictionary, selectLettersFromWord, shuffleArray };
