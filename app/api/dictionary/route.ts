import { NextResponse } from "next/server";
import dictionary from "../../../public/dictionary.json";

export async function GET() {
	return NextResponse.json(dictionary);
}
