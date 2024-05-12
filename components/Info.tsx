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

const Info = () => {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button
					size='icon'
					className='rounded-md'>
					<InfoIcon className='text-cream' />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>How to Play / Nasıl Oynanır</DialogTitle>
					<DialogDescription>
						Welcome to the Spelling Bee Game! You get seven letters to form
						words. Each word must be at least three letters long. Points are
						awarded based on word length. Our dictionary is limited, so thank
						you for your understanding!
						<br />
						<br />
						Spelling Bee Oyununa hoş geldiniz! Kelime oluşturmak için yedi harf
						alırsınız. Her kelime en az üç harfli olmalıdır. Puanlar kelimenin
						uzunluğuna göre verilir. Sözlüğümüz geniş değildir, anlayışınız için
						teşekkürler!
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default Info;
