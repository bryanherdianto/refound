import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
	title: "ReFound",
	description: "AI-powered smart donation and claiming flow",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased">
			<body className="min-h-full flex flex-col">
				<ClerkProvider>
					<Header />
					<main className="flex-1">
						<Providers>{children}</Providers>
					</main>
					<Footer />
				</ClerkProvider>
			</body>
		</html>
	);
}
