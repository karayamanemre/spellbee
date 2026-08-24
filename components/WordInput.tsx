import React, { useRef, useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { CornerDownLeft, Delete } from "lucide-react";
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

	const [shouldFocus, setShouldFocus] = useState(false);

	useEffect(() => {
		if (shouldFocus && inputRef.current) {
			inputRef.current.focus();
			setShouldFocus(false);
		}
	}, [shouldFocus]);

	const submitCurrentWord = () => {
		onSubmit(isTurkish ? word.toLocaleLowerCase("tr-TR") : word.toLowerCase());
		setWord("");
		setShouldFocus(true);
	};

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		submitCurrentWord();
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
					value={
						isTurkish ? word.toLocaleUpperCase("tr-TR") : word.toUpperCase()
					}
					onChange={(e) => setWord(e.target.value)}
					onKeyDown={(event) => {
						if (event.key === "Enter") {
							event.preventDefault();
							submitCurrentWord();
						}
					}}
					placeholder={placeholderText}
					autoComplete='off'
					aria-label={placeholderText}
					className={`h-[40px] lg:h-[50px] text-2xl lg:text-3xl border-cream text-cream py-2 outline-none focus:ring-0 border-b-2 shadow-[0px_4px_0px_#000000] rounded-none uppercase read-only:`}
				/>
				<Button
					variant='ghost'
					type='button'
					name='backspace button'
					aria-label={isTurkish ? "Son harfi sil" : "Delete last letter"}
					onClick={() => setWord(word.slice(0, word.length - 1))}
					className='absolute -top-1 lg:top-2 right-[60px] bg-brick p-2 rounded-md shadow-[0px_3px_1px] hover:bg-brick text-black'>
					<Delete />
				</Button>
				<Button
					variant='ghost'
					type='submit'
					aria-label={isTurkish ? "Kelimeyi gönder" : "Submit word"}
					className='absolute -top-1 lg:top-2 right-[1px] bg-cream p-2 rounded-md shadow-[0px_3px_1px] hover:bg-mustard text-black'>
					<CornerDownLeft />
				</Button>
			</div>
		</form>
	);
};

export default WordInput;
