import React, { useEffect, useState } from "react";

interface TimerProps {
	initialTime: number;
	onTimeUp: () => void;
	addTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, addTime }) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [showAnimation, setShowAnimation] = useState(false);

	useEffect(() => {
		setTimeLeft(initialTime);
	}, [initialTime]);

	useEffect(() => {
		if (timeLeft === 0) {
			onTimeUp();
			return;
		}
		const timer = setTimeout(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [timeLeft, onTimeUp]);

	useEffect(() => {
		if (addTime > 0) {
			setTimeLeft((prevTime) => prevTime + addTime);
			setShowAnimation(true);
			const timeout = setTimeout(() => setShowAnimation(false), 1000);
			return () => clearTimeout(timeout);
		}
	}, [addTime]);

	return (
		<div className='flex items-center justify-between border-r-2 border-b-2 bg-yellow-400 rounded-br-md p-1 shadow-lg border-primary w-32 relative'>
			<p>Time:</p>
			<p className='font-bold'>{timeLeft} s</p>
			{showAnimation && (
				<p className='time-add-animation ml-[88px] text-sm font-bold absolute top-2 -right-10'>
					+15 s
				</p>
			)}
		</div>
	);
};

export default Timer;
