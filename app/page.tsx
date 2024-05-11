"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		const browserLang = window.navigator.language;

		const langPrefix = browserLang.includes("-")
			? browserLang.split("-")[0]
			: browserLang;

		if (langPrefix === "tr") {
			redirect("/tr");
		} else if (langPrefix === "en") {
			redirect("/en");
		} else {
			redirect("/en");
		}
	}, []);

	return <main className='h-full'></main>;
}
