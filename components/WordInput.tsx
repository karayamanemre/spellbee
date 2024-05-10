import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CornerDownLeft } from "lucide-react";

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
			className='flex flex-col gap-6 items-center justify-center p-4'>
			<div className='relative w-full'>
				<Input
					type='text'
					value={word}
					onChange={(e) => setWord(e.target.value)}
					placeholder='Enter word'
					autoComplete='off'
					autoFocus
					className='h-[40px] text-lg focus:outline-dashed focus:outline-yellow-600 outline-none focus:ring-0 uppercase'
				/>
				<Button
					variant='ghost'
					type='submit'
					className='absolute top-[2px] right-[2px] hover:bg-yellow-300 p-2 rounded-md hover:dark:text-black'>
					<CornerDownLeft />
				</Button>
			</div>
		</form>
	);
};

export default WordInput;
