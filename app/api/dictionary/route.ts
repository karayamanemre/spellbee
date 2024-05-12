import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(res: NextApiResponse, req: NextApiRequest) {
	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://spellbee-rho.vercel.app/"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") {
		res.status(200).end();
		return;
	}

	try {
		const data = await fetch(`https://spellbee-rho.vercel.app/dictionary.json`);
		if (!data.ok) {
			throw new Error("Failed to load dictionary");
		}
		const dictionary = await data.json();
		return NextResponse.json(dictionary);
	} catch (error) {
		console.error("Error loading the dictionary:", error);
	}
}
