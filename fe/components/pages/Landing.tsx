"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
	Camera,
	Users,
	Heart,
	QrCode,
	Sparkles,
	ArrowRight,
	Quote,
} from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function Landing() {
	const router = useRouter();

	return (
		<div>
			{/* Hero Section */}
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-20 md:mb-28">
					{/* Left: Text Content */}
					<div className="space-y-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f4ee] text-[#1a365d] rounded-full text-sm font-medium">
							<Sparkles className="w-4 h-4 text-[#7b9e87]" />
							AI-Powered Smart Donation
						</div>

						<h1 className="text-4xl md:text-5xl lg:text-6xl leading-[1.1]! tracking-tight">
							Turn Everyday Items into{" "}
							<span className="text-[#7b9e87]">Opportunities</span>
						</h1>

						<p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
							Drop your items into our smart donation box. AI detects and
							categorizes them instantly, making them available to those who
							need them most.
						</p>

						<div className="flex flex-col sm:flex-row gap-4 pt-2">
							<Button
								size="lg"
								onClick={() => router.push("/donate")}
								className="text-base px-8 py-6 h-auto bg-[#7b9e87] hover:bg-[#6a8a75] text-white shadow-lg hover:shadow-xl transition-all"
							>
								<QrCode className="w-5 h-5 mr-2" />
								Donate Item
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
							<Button
								size="lg"
								variant="outline"
								onClick={() => router.push("/items")}
								className="text-base px-8 py-6 h-auto border-2 border-[#1a365d]/20 hover:border-[#7b9e87] hover:bg-[#e8f4ee] transition-all"
							>
								Browse Items
							</Button>
						</div>
					</div>

					{/* Right: Hero Image */}
					<div className="relative lg:pl-4">
						<div className="aspect-square lg:aspect-4/5 rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(26,54,93,0.3)]">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1771323994415-aba85604d4b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
								alt="Donation box"
								className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
							/>
						</div>
						{/* Stats Card */}
						<div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 bg-white p-6 md:p-8 rounded-2xl shadow-[0_8px_30px_-5px_rgba(26,54,93,0.2)] max-w-55">
							<div className="flex items-baseline gap-1">
								<span className="text-4xl md:text-5xl font-semibold text-[#7b9e87]">
									2.3k+
								</span>
							</div>
							<p className="text-sm text-muted-foreground mt-1">
								Items Recycled
							</p>
							<div className="mt-4 h-2 bg-[#e8f4ee] rounded-full overflow-hidden">
								<div className="h-full bg-[#7b9e87] w-[85%] rounded-full"></div>
							</div>
						</div>
						{/* Floating Badge */}
						<div className="absolute -top-4 -right-4 md:top-6 md:-right-6 bg-[#1a365d] text-white p-4 rounded-2xl shadow-lg">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium">Live Now</span>
							</div>
						</div>
					</div>
				</div>

				{/* How It Works */}
				<div className="mb-24 md:mb-32">
					<div className="text-center mb-12 md:mb-16">
						<span className="inline-block px-4 py-1.5 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-sm font-medium mb-4">
							Simple Process
						</span>
						<h2 className="text-3xl md:text-4xl mb-4">How It Works</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Four simple steps to make a difference in your community
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
						{[
							{
								icon: QrCode,
								title: "Scan QR",
								desc: "Scan QR code to start donation process",
								color: "bg-[#e8f4ee]",
								iconColor: "text-[#7b9e87]",
							},
							{
								icon: Camera,
								title: "AI Detection",
								desc: "AI scans and validates your donated item",
								color: "bg-[#e8f4ee]",
								iconColor: "text-[#7b9e87]",
							},
							{
								icon: Users,
								title: "Get Claimed",
								desc: "Items available for community to claim",
								color: "bg-[#e8f4ee]",
								iconColor: "text-[#7b9e87]",
							},
							{
								icon: Heart,
								title: "Earn Rewards",
								desc: "Get points and recognition for donations",
								color: "bg-[#e8f4ee]",
								iconColor: "text-[#7b9e87]",
							},
						].map((step, index) => (
							<div
								key={step.title}
								className="group relative text-center p-6 md:p-8 rounded-2xl bg-white border border-[#1a365d]/5 hover:border-[#7b9e87]/30 hover:shadow-lg transition-all duration-300"
							>
								<div
									className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300`}
								>
									<step.icon className={`w-8 h-8 ${step.iconColor}`} />
								</div>
								<div className="absolute top-3 right-3 w-8 h-8 bg-[#7b9e87] text-white rounded-full flex items-center justify-center text-sm font-semibold">
									{index + 1}
								</div>
								<h3 className="text-lg md:text-xl font-semibold mb-3">
									{step.title}
								</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">
									{step.desc}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* Image Showcase */}
				<div className="mb-24 md:mb-32">
					<div className="text-center mb-12 md:mb-16">
						<span className="inline-block px-4 py-1.5 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-sm font-medium mb-4">
							Impact Stories
						</span>
						<h2 className="text-3xl md:text-4xl mb-4">See The Difference</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Real moments of giving that connect our community
						</p>
					</div>
					<div className="grid md:grid-cols-2 gap-6 md:gap-8">
						<div className="group relative rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(26,54,93,0.2)] aspect-4/3">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1722336762551-831c0bcc2b59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
								alt="People donating items"
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-[#2d5016]/80 via-[#2d5016]/20 to-transparent flex items-end p-6 md:p-8">
								<div className="text-white">
									<h3 className="text-2xl font-semibold mb-2">
										Give Back to Community
									</h3>
									<p className="text-sm opacity-90">
										Share what you don&apos;t need with those who do
									</p>
								</div>
							</div>
						</div>

						<div className="group relative rounded-3xl overflow-hidden shadow-[0_10px_40px_-10px_rgba(26,54,93,0.2)] aspect-4/3">
							<ImageWithFallback
								src="https://images.unsplash.com/photo-1764555241048-f1fc72201704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
								alt="Community helping hands"
								className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
							/>
							<div className="absolute inset-0 bg-linear-to-t from-[#2d5016]/80 via-[#2d5016]/20 to-transparent flex items-end p-6 md:p-8">
								<div className="text-white">
									<h3 className="text-2xl font-semibold mb-2">
										Make an Impact
									</h3>
									<p className="text-sm opacity-90">
										Every donation helps someone in need
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="mb-24 md:mb-32">
					<div className="text-center mb-12 md:mb-16">
						<span className="inline-block px-4 py-1.5 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-sm font-medium mb-4">
							Our Impact
						</span>
						<h2 className="text-3xl md:text-4xl mb-4">Making a Difference</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Together, we're building a more sustainable and caring community
						</p>
					</div>
					<div className="bg-white rounded-3xl shadow-[0_8px_40px_-10px_rgba(26,54,93,0.12)] p-8 md:p-12">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
							{[
								{
									value: "247",
									label: "Items Donated",
									color: "text-[#7b9e87]",
								},
								{
									value: "89%",
									label: "Success Rate",
									color: "text-[#1a365d]",
								},
								{
									value: "156",
									label: "People Helped",
									color: "text-[#7b9e87]",
								},
								{
									value: "24/7",
									label: "Always Open",
									color: "text-[#1a365d]",
								},
							].map((stat) => (
								<div key={stat.label} className="text-center">
									<div
										className={`text-4xl md:text-5xl font-semibold ${stat.color} mb-2`}
									>
										{stat.value}
									</div>
									<div className="text-sm md:text-base text-muted-foreground font-medium">
										{stat.label}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Testimonials */}
				<div className="mb-24 md:mb-32">
					<div className="text-center mb-12 md:mb-16">
						<span className="inline-block px-4 py-1.5 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-sm font-medium mb-4">
							Community Voices
						</span>
						<h2 className="text-3xl md:text-4xl mb-4">
							What Our Community Says
						</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							Real stories from donors and recipients making an impact
						</p>
					</div>
					<div className="grid md:grid-cols-3 gap-6 md:gap-8">
						{[
							{
								quote:
									"I donated my old textbooks and they found a new home within days. It's amazing to see how technology makes giving so seamless.",
								author: "Sarah Chen",
								role: "Donor",
							},
							{
								quote:
									"As a student on a tight budget, finding quality items here has been a lifesaver. The community support is incredible.",
								author: "Marcus Johnson",
								role: "Recipient",
							},
							{
								quote:
									"The AI detection made donating so easy. I just dropped off my items and the app notified me when someone claimed them.",
								author: "Emma Rodriguez",
								role: "Donor",
							},
						].map((testimonial, index) => (
							<div
								key={index}
								className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_8px_30px_-5px_rgba(26,54,93,0.08)] border border-[#1a365d]/5 hover:shadow-lg transition-all duration-300"
							>
								<Quote className="w-8 h-8 text-[#7b9e87] mb-4" />
								<p className="text-muted-foreground leading-relaxed mb-6">
									"{testimonial.quote}"
								</p>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-full bg-[#e8f4ee] flex items-center justify-center">
										<span className="text-[#7b9e87] font-semibold text-sm">
											{testimonial.author
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</span>
									</div>
									<div>
										<p className="font-semibold text-[#1a365d]">
											{testimonial.author}
										</p>
										<p className="text-sm text-muted-foreground">
											{testimonial.role}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* CTA Section */}
				<div className="text-center bg-linear-to-br from-[#7b9e87] to-[#6a8a75] rounded-3xl p-10 md:p-16 text-white shadow-[0_20px_60px_-15px_rgba(123,158,135,0.4)]">
					<h2 className="text-3xl md:text-4xl mb-4 text-white">
						Ready to Make a Difference?
					</h2>
					<p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
						Join our community of donors and help us create a more sustainable,
						caring world.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							onClick={() => router.push("/donate")}
							className="bg-white text-[#1a365d] hover:bg-white/90 px-8 py-6 h-auto text-base font-semibold shadow-lg"
						>
							Start Donating
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
						<Button
							size="lg"
							onClick={() => router.push("/items")}
							variant="outline"
							className="bg-transparent border-2 border-white text-white hover:bg-white/30 px-8 py-6 h-auto text-base font-semibold"
						>
							Browse Items
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
