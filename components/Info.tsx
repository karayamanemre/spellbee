import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogTrigger,
} from "@/components/ui/dialog";
import { InfoIcon } from "lucide-react";
import { Button } from "./ui/button";
import { GAME_RULES } from "@/lib/gameEngine";

const Info = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size='icon'
					aria-label='How to play / Nasıl oynanır'
					className='rounded-md'>
					<InfoIcon className='text-cream' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='font-semibold text-lg lg:text-xl'>
						How to Play / Nasıl Oynanır
					</DialogTitle>
					<DialogDescription className='text-base lg:text-lg'>
						Build words using each displayed letter no more than once. Words
						must contain at least {GAME_RULES.minimumWordLength} letters. You
						start with {GAME_RULES.initialScore} points and{" "}
						{GAME_RULES.initialTime} seconds. Each letter earns{" "}
						{GAME_RULES.pointsPerLetter} points and each accepted word adds{" "}
						{GAME_RULES.secondsPerWord} seconds. A word scores only once per
						game. Hints cost {GAME_RULES.hintCost}, shuffles cost{" "}
						{GAME_RULES.shuffleCost}, and new letters cost{" "}
						{GAME_RULES.newLettersCost} points.
						<br />
						<br />
						Gösterilen her harfi en fazla göründüğü kadar kullanarak kelimeler
						oluşturun. Kelimeler en az {GAME_RULES.minimumWordLength} harfli
						olmalıdır. Oyuna {GAME_RULES.initialScore} puan ve{" "}
						{GAME_RULES.initialTime} saniye ile başlarsınız. Her harf{" "}
						{GAME_RULES.pointsPerLetter} puan, kabul edilen her kelime{" "}
						{GAME_RULES.secondsPerWord} saniye kazandırır. Bir kelime oyun
						boyunca yalnızca bir kez puan getirir. İpucu {GAME_RULES.hintCost},
						karıştırma {GAME_RULES.shuffleCost}, yeni harfler{" "}
						{GAME_RULES.newLettersCost} puandır.
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default Info;
