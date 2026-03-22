"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	Show,
	UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Menu, X } from "lucide-react";

const navigation = [
	{ name: "Browse Items", href: "/items" },
	{ name: "Donate", href: "/donate" },
];

export function Header() {
	const router = useRouter();
	const pathname = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	// Handle scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		handleScroll(); // Check initial scroll position
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const isHomePage = pathname === "/";

	return (
		<header
			className={`sticky top-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-white/90 backdrop-blur-xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.08)]"
					: "bg-transparent"
			}`}
		>
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-16 md:h-20">
					{/* Left: Logo */}
					<div className="flex items-center">
						{/* Logo */}
						<button
							onClick={() => router.push("/")}
							className="flex items-center gap-3 group"
						>
							<Image
								src="/logo_refound.svg"
								alt="ReFound Logo"
								width={44}
								height={44}
								className="w-9 h-9 md:w-11 md:h-11"
								priority
							/>
							<div className="hidden sm:block">
								<span className="text-xl md:text-2xl font-semibold tracking-tight text-[#1a365d]">
									ReFound
								</span>
							</div>
						</button>
					</div>

					{/* Center: Navigation (Desktop) */}
					<nav className="hidden md:flex items-center gap-1">
						{navigation.map((item) => (
							<button
								key={item.name}
								onClick={() => router.push(item.href)}
								className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
									pathname === item.href || pathname.startsWith(item.href)
										? "text-[#1a365d] bg-[#e8f4ee]"
										: "text-muted-foreground hover:text-[#1a365d] hover:bg-[#e8f4ee]/50"
								}`}
							>
								{item.name}
							</button>
						))}
					</nav>

					{/* Right: CTA + Auth + Mobile Menu */}
					<div className="flex items-center gap-2">
						<Show when="signed-out">
							<SignInButton mode="modal">
								<Button
									variant="ghost"
									className="hidden sm:flex text-[#1a365d] hover:bg-[#e8f4ee]"
								>
									Sign In
								</Button>
							</SignInButton>
							<SignUpButton mode="modal">
								<Button className="hidden sm:flex bg-[#1a365d] hover:bg-[#1a365d]/90 text-white shadow-sm">
									Sign Up
								</Button>
							</SignUpButton>
						</Show>
						<Show when="signed-in">
							<button
								onClick={() => router.push("/tracking")}
								className={`hidden md:flex px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
									pathname === "/tracking" || pathname.startsWith("/tracking")
										? "text-[#1a365d] bg-[#e8f4ee]"
										: "text-muted-foreground hover:text-[#1a365d] hover:bg-[#e8f4ee]/50"
								}`}
							>
								Track Claims
							</button>
							<UserButton />
						</Show>

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
							className="md:hidden h-10 w-10 rounded-full hover:bg-accent/50"
						>
							{mobileMenuOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
					mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="container mx-auto px-4 pb-4">
					<div className="bg-white rounded-2xl shadow-lg border p-2 space-y-1">
						{navigation.map((item) => (
							<button
								key={item.name}
								onClick={() => router.push(item.href)}
								className={`w-full px-4 py-3 text-sm font-medium rounded-xl text-left transition-all duration-200 flex items-center gap-3 ${
									pathname === item.href || pathname.startsWith(item.href)
										? "text-[#1a365d] bg-[#e8f4ee]"
										: "text-muted-foreground hover:text-[#1a365d] hover:bg-[#e8f4ee]/50"
								}`}
							>
								<span className="w-1.5 h-1.5 rounded-full bg-current"></span>
								{item.name}
							</button>
						))}
					</div>
				</div>
			</div>
		</header>
	);
}
