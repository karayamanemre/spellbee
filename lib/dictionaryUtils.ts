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

function selectRandomLetters(words: string[], count: number = 7): string[] {
	const allLetters = words.join("").split("");
	const randomLetters = [];
	for (let i = 0; i < count; i++) {
		const randomIndex = Math.floor(Math.random() * allLetters.length);
		randomLetters.push(allLetters[randomIndex].toUpperCase());
	}
	return randomLetters;
}

export { loadDictionary, selectRandomLetters };
