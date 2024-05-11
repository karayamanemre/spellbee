import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CornerDownLeft } from "lucide-react";
import useGetLanguage from "@/lib/useGetLanguage";

interface WordInputProps {
	onSubmit: (word: string) => void;
}

const WordInput: React.FC<WordInputProps> = ({ onSubmit }) => {
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";
	const [word, setWord] = useState("");

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(word);
		setWord("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col gap-6 items-center justify-center py-4 w-full'>
			<div className='relative w-full'>
				<Input
					type='text'
					value={word}
					onChange={(e) => setWord(e.target.value)}
					placeholder={isTurkish ? "Kelime Girin" : "Enter a Word"}
					autoComplete='off'
					autoFocus
					className='h-[50px] text-3xl border-cream text-cream py-2 outline-none focus:ring-0 uppercase border-b-2 shadow-none rounded-none'
				/>
				<Button
					variant='ghost'
					type='submit'
					className='absolute top-[8px] right-[1px] bg-cream hover:bg-mustard p-2 rounded-md'>
					<CornerDownLeft />
				</Button>
			</div>
		</form>
	);
};

export default WordInput;
