import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
	const acceptLanguage = (await headers()).get("accept-language")?.toLowerCase();
	redirect(acceptLanguage?.startsWith("tr") ? "/tr" : "/en");
}
