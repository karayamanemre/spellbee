import { NextResponse } from "next/server";

export async function GET() {
	const data = await fetch(`https://spellbee-rho.vercel.app/dictionary.json`);
	if (!data.ok) {
		throw new Error("Failed to load dictionary");
	}
	const dictionary = await data.json();
	return NextResponse.json(dictionary);
}
