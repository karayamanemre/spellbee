import React, { useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CornerDownLeft } from "lucide-react";
import useGetLanguage from "@/lib/useGetLanguage";

interface WordInputProps {
	onSubmit: (word: string) => void;
	word: string;
	setWord: React.Dispatch<React.SetStateAction<string>>;
}

const WordInput: React.FC<WordInputProps> = ({ onSubmit, word, setWord }) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const languageCode = useGetLanguage();
	const isTurkish = languageCode === "tr";

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [word]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		onSubmit(word);
		setWord("");
	};

	const placeholderText = isTurkish ? "KELİME GİRİN" : "ENTER A WORD";

	return (
		<form
			onSubmit={handleSubmit}
			className='flex flex-col gap-6 items-center justify-center py-4 w-full'>
			<div className='relative w-full'>
				<Input
					ref={inputRef}
					type='text'
					value={word}
					onChange={(e) => {
						setWord(e.target.value);
						if (inputRef.current) inputRef.current.focus();
					}}
					placeholder={placeholderText}
					autoComplete='off'
					autoFocus
					className={`h-[40px] lg:h-[50px] text-2xl lg:text-3xl border-cream text-cream py-2 outline-none focus:ring-0 border-b-2 shadow-[0px_4px_0px_#000000] rounded-none uppercase`}
				/>
				<Button
					variant='ghost'
					type='submit'
					className='absolute -top-1 lg:top-2 right-[1px] bg-cream p-2 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black'>
					<CornerDownLeft />
				</Button>
			</div>
		</form>
	);
};

export default WordInput;
