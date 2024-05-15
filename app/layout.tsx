import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Reddit_Mono as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: "Spell It",
	description: "A spelling game for everyone",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='tr'
			maximum-scale='1'>
			<body
				className={cn(
					"max-h-screen flex items-center justify-center font-sans antialiased ",
					fontSans.variable
				)}>
				{children}
				<Analytics />
				<Navbar />
			</body>
		</html>
	);
}
