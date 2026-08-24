import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";

interface TimerProps {
	initialTime: number;
	onTimeUp: () => void;
}

export interface TimerHandle {
	addTime: (seconds: number) => void;
}

const Timer = forwardRef<TimerHandle, TimerProps>(function Timer(
	{ initialTime, onTimeUp },
	ref
) {
	const [timeLeft, setTimeLeft] = useState(initialTime);
	const [animationAddTime, setAnimationAddTime] = useState(0);
	const onTimeUpRef = useRef(onTimeUp);
	const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		onTimeUpRef.current = onTimeUp;
	}, [onTimeUp]);

	useImperativeHandle(ref, () => ({
		addTime(seconds: number) {
			if (seconds <= 0) return;
			setTimeLeft((current) => current + seconds);
			setAnimationAddTime(seconds);
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
			animationTimeoutRef.current = setTimeout(
				() => setAnimationAddTime(0),
				1000
			);
		},
	}));

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeLeft((current) => {
				if (current <= 1) {
					clearInterval(interval);
					onTimeUpRef.current();
					return 0;
				}
				return current - 1;
			});
		}, 1000);

		return () => {
			clearInterval(interval);
			if (animationTimeoutRef.current) {
				clearTimeout(animationTimeoutRef.current);
			}
		};
	}, []);

	const minutes = Math.floor(timeLeft / 60);
	const seconds = timeLeft % 60;
	const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

	return (
		<div className='flex items-center justify-center border-4 bg-cream rounded-md p-1 shadow-[0px_3px_1px] border-primary w-32 relative drop-shadow-2xl'>
			<p className='font-bold text-xl sm:text-3xl' aria-label={`${timeLeft} seconds remaining`}>
				{formattedTime}
			</p>
			{animationAddTime > 0 && (
				<p className='time-add-animation text-2xl font-bold'>
					+{animationAddTime}
				</p>
			)}
		</div>
	);
});

export default Timer;
