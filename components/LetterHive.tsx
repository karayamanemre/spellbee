import React from "react";

interface LetterHiveProps {
	letters: string[];
}

const LetterHive: React.FC<LetterHiveProps> = ({ letters }) => {
	return (
		<div className='flex justify-center space-x-2'>
			{letters.map((letter, index) => (
				<span
					key={index}
					className='text-xl font-bold'>
					{letter}
				</span>
			))}
		</div>
	);
};

export default LetterHive;
