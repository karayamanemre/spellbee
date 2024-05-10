import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface WordInputProps {
	onSubmit: (word: string) => void;
}

const WordInput: React.FC<WordInputProps> = ({ onSubmit }) => {
	const [word, setWord] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(word);
		setWord("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col gap-6 items-center justify-center'>
			<Input
				type='text'
				value={word}
				onChange={(e) => setWord(e.target.value)}
				className='text-lg p-2 border border-gray-300 rounded'
				placeholder='Enter word'
				autoComplete='off'
			/>
			<Button
				type='submit'
				className='ml-2 bg-blue-500 text-white p-2 rounded'>
				Submit
			</Button>
		</form>
	);
};

export default WordInput;
