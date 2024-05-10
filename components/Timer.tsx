import React, { useEffect, useState } from "react";

interface TimerProps {
	initialTime: number;
	onTimeUp: () => void;
	addTime: number;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, addTime }) => {
	const [timeLeft, setTimeLeft] = useState(initialTime);

	useEffect(() => {
		if (timeLeft === 0) {
			onTimeUp();
			return;
		}

		const timer = setTimeout(() => {
			setTimeLeft(timeLeft - 1);
		}, 1000);

		return () => clearTimeout(timer);
	}, [timeLeft]);

	const addExtraTime = () => {
		setTimeLeft((time) => time + addTime);
	};

	return (
		<div>
			<p>Time Remaining: {timeLeft} seconds</p>
			<button onClick={addExtraTime}>Add Extra Time</button>
		</div>
	);
};

export default Timer;
