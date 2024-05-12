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
					<DialogTitle>
						<h3 className='font-semibold text-lg lg:text-xl'>
							How to Play / Nasıl Oynanır
						</h3>
					</DialogTitle>
					<DialogDescription>
						<p className='text-base lg:text-lg'>
							Welcome to Spell It! You start with 20 points. Each word must be
							at least three letters long. Points are awarded based on word
							length. Using a hint costs 20 points, shuffling letters costs 2
							points, and getting new letters costs 50 points. Our dictionary is
							limited, so thank you for your understanding!
							<br />
							<br />
							Spell It Oyununa hoş geldiniz! 20 puan ile başlarsınız. Her kelime
							en az üç harfli olmalıdır. Puanlar kelimenin uzunluğuna göre
							verilir. İpucu kullanmak 20 puan, harfleri karıştırmak 2 puan ve
							yeni harfler almak 50 puan maliyetindedir. Sözlüğümüz geniş
							değildir, anlayışınız için teşekkürler!
						</p>
					</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	);
};

export default Info;
