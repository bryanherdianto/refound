"use client";

import { useRouter } from "next/navigation";
import { Mail, Phone } from "lucide-react";
import Image from "next/image";

const navigation = [
	{ name: "Browse Items", href: "/items" },
	{ name: "Donate", href: "/donate" },
	{ name: "Track Claims", href: "/tracking" },
];

const resources = [
	{ name: "Donation Guidelines", href: "/donate" },
	{ name: "Pickup Locations", href: "/locations" },
	{ name: "FAQ", href: "/faq" },
];

export function Footer() {
	const router = useRouter();
	const currentYear = new Date().getFullYear();

	return (
		<footer className="bg-[#1a365d] text-white">
			{/* Main Footer */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
					{/* Brand Column */}
					<div className="lg:col-span-1">
						<div className="flex items-center gap-3 mb-4">
							<Image
								src="/logo_refound.svg"
								alt="ReFound Logo"
								width={44}
								height={44}
								className="w-9 h-9 md:w-11 md:h-11"
								priority
							/>
							<span className="text-2xl font-semibold tracking-tight">
								ReFound
							</span>
						</div>
						<p className="text-sm text-white/70 leading-relaxed mb-6">
							AI-powered smart donation platform turning everyday items into
							opportunities for those in need.
						</p>
					</div>

					{/* Navigation Column */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
							Quick Links
						</h3>
						<ul className="space-y-3">
							{navigation.map((item) => (
								<li key={item.name}>
									<button
										onClick={() => router.push(item.href)}
										className="text-sm text-white/70 hover:text-[#7b9e87] transition-colors duration-200"
									>
										{item.name}
									</button>
								</li>
							))}
						</ul>
					</div>

					{/* Resources Column */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
							Resources
						</h3>
						<ul className="space-y-3">
							{resources.map((item) => (
								<li key={item.name}>
									<button
										onClick={() => router.push(item.href)}
										className="text-sm text-white/70 hover:text-[#7b9e87] transition-colors duration-200"
									>
										{item.name}
									</button>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Column */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/90">
							Contact
						</h3>
						<ul className="space-y-4">
							<li className="flex items-center gap-3">
								<Mail className="w-4 h-4 text-[#7b9e87] shrink-0" />
								<a
									href="mailto:bryan.herdianto@gmail.com"
									className="text-sm text-white/70 hover:text-[#7b9e87] transition-colors duration-200"
								>
									bryan.herdianto@gmail.com
								</a>
							</li>
							<li className="flex items-center gap-3">
								<Phone className="w-4 h-4 text-[#7b9e87] shrink-0" />
								<span className="text-sm text-white/70">+62 855-8866-900</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-white/10">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<div className="flex flex-col md:flex-row items-center justify-center gap-4">
						<p className="text-sm text-white/50">
							&copy; {currentYear} ReFound. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
