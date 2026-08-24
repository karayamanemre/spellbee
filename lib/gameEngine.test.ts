import { describe, expect, it } from "vitest";
import {
	canFormWord,
	evaluateSubmission,
	findFormableWords,
	GAME_RULES,
	normalizeWord,
	sanitizeDictionary,
	selectRoundLetters,
} from "./gameEngine";
import dictionary from "../public/dictionary.json";

describe("word normalization", () => {
	it("handles English and Turkish casing correctly", () => {
		expect(normalizeWord("  WRITING  ", "en")).toBe("writing");
		expect(normalizeWord(" İNSAN ", "tr")).toBe("insan");
		expect(normalizeWord("IŞIK", "tr")).toBe("ışık");
	});

	it("deduplicates and filters unusable dictionary entries", () => {
		expect(sanitizeDictionary(["CAT", "cat", "a", "two words", 42], "en"))
			.toEqual(["cat"]);
	});
});

describe("letter rules", () => {
	it("does not let a letter be used more often than it appears", () => {
		expect(canFormWord("room", ["r", "o", "o", "m", "a", "b", "c"]))
			.toBe(true);
		expect(canFormWord("room", ["r", "o", "m", "a", "b", "c", "d"]))
			.toBe(false);
	});

	it("finds every eligible word for a round", () => {
		expect(
			findFormableWords(["w", "r", "i", "t", "i", "n", "g"], [
				"wig",
				"wit",
				"writing",
				"wrong",
			])
		).toEqual(["wig", "wit", "writing"]);
	});
});

describe("submission and scoring", () => {
	const base = {
		language: "en" as const,
		letters: ["w", "r", "i", "t", "i", "n", "g"],
		dictionary: ["wig", "wit", "writing"],
	};

	it("awards points by normalized character count", () => {
		expect(
			evaluateSubmission({ ...base, word: "writing", guessedWords: new Set() })
		).toEqual({
			status: "accepted",
			word: "writing",
			points: 7 * GAME_RULES.pointsPerLetter,
		});
	});

	it("rejects a word already found in any earlier round", () => {
		expect(
			evaluateSubmission({
				...base,
				word: "WIG",
				guessedWords: new Set(["wig"]),
			})
		).toMatchObject({ status: "duplicate", points: 0 });
	});

	it("distinguishes short, impossible, and unknown words", () => {
		expect(
			evaluateSubmission({ ...base, word: "it", guessedWords: new Set() })
				.status
		).toBe("too-short");
		expect(
			evaluateSubmission({ ...base, word: "wrong", guessedWords: new Set() })
				.status
		).toBe("not-formable");
		expect(
			evaluateSubmission({ ...base, word: "win", guessedWords: new Set() })
				.status
		).toBe("not-found");
	});
});

describe("round generation", () => {
	it("always returns seven letters and at least three possible words", () => {
		const dictionary = ["wig", "wit", "writing", "rig", "cat", "catalog"];
		const letters = selectRoundLetters(dictionary);
		expect(letters).toHaveLength(GAME_RULES.lettersPerRound);
		expect(findFormableWords(letters, dictionary).length).toBeGreaterThanOrEqual(
			GAME_RULES.minimumWordsPerRound
		);
	});
});

describe("bundled dictionaries", () => {
	it.each([
		["en" as const, dictionary.englishWords, 100],
		["tr" as const, dictionary.turkishWords, 60],
	])(
		"keeps the %s dictionary clean and rich in playable rounds",
		(language, rawWords, minimumPlayableRounds) => {
			const words = sanitizeDictionary(rawWords, language);
			expect(words).toHaveLength(rawWords.length);

			const playableRounds = words.filter(
				(word) =>
					Array.from(word).length === GAME_RULES.lettersPerRound &&
					findFormableWords(Array.from(word), words).length >=
						GAME_RULES.minimumWordsPerRound
			);
			expect(playableRounds.length).toBeGreaterThanOrEqual(
				minimumPlayableRounds
			);
		}
	);
});
