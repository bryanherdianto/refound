"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
	Gift,
	Star,
	Heart,
	Mail,
	Award,
	CheckCircle,
	Home,
	RotateCcw,
	Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";

export function DonateReward() {
	const router = useRouter();

	useEffect(() => {
		// Fire confetti with green color palette
		const duration = 3000;
		const end = Date.now() + duration;

		const colors = ["#7b9e87", "#6a8a75", "#e8f4ee", "#1a365d"];

		(function frame() {
			confetti({
				particleCount: 4,
				angle: 60,
				spread: 55,
				origin: { x: 0 },
				colors: colors,
			});
			confetti({
				particleCount: 4,
				angle: 120,
				spread: 55,
				origin: { x: 1 },
				colors: colors,
			});

			if (Date.now() < end) {
				requestAnimationFrame(frame);
			}
		})();
	}, []);

	return (
		<div className="pb-20 relative overflow-hidden">
			<div className="container mx-auto px-4 py-6 max-w-2xl relative z-10">
				{/* Success Icon */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f4ee] text-[#1a365d] rounded-full text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4 text-[#7b9e87]" />
						Donation Complete
					</div>
					<div className="w-24 h-24 bg-linear-to-br from-[#7b9e87] to-[#6a8a75] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#7b9e87]/30 mb-6">
						<Gift className="w-12 h-12 text-white" />
					</div>
					<h1 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-2">
						Thank You!
					</h1>
					<p className="text-muted-foreground">
						Your donation has been successfully registered
					</p>
				</div>

				{/* Reward Card */}
				<Card className="p-6 md:p-8 bg-linear-to-br from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-xl shadow-[#7b9e87]/20 mb-6">
					<div className="text-center space-y-4">
						<div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto">
							<Award className="w-8 h-8 text-white" />
						</div>
						<div>
							<p className="text-white/80 mb-2 text-sm uppercase tracking-wider font-medium">
								You&apos;ve earned
							</p>
							<p className="text-4xl md:text-5xl font-bold">50 Points</p>
						</div>
						<div className="flex items-center justify-center gap-1">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									className="w-5 h-5 fill-yellow-300 text-yellow-300"
								/>
							))}
						</div>
					</div>
				</Card>

				{/* Donation Summary */}
				<Card className="p-6 mb-6 border-[#e8f4ee] shadow-sm">
					<h3 className="text-base font-semibold text-[#1a365d] mb-4 flex items-center gap-2">
						<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
							<CheckCircle className="w-4 h-4 text-[#7b9e87]" />
						</div>
						Donation Summary
					</h3>
					<div className="space-y-3">
						<div className="flex justify-between text-sm items-center">
							<span className="text-muted-foreground">Status</span>
							<span className="flex items-center gap-1.5 font-medium text-[#7b9e87]">
								<CheckCircle className="w-4 h-4" />
								Received
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Processing</span>
							<span className="font-medium text-[#1a365d]">
								AI Detection Complete
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Item Will Be</span>
							<span className="font-medium text-[#1a365d]">
								Available in 48 hours
							</span>
						</div>
						<div className="flex justify-between text-sm">
							<span className="text-muted-foreground">Reward Points</span>
							<span className="font-medium text-[#7b9e87]">+50 Points</span>
						</div>
					</div>
				</Card>

				{/* Impact Stats */}
				<div className="grid grid-cols-2 gap-4 mb-6">
					<Card className="p-4 text-center border-[#e8f4ee] shadow-sm">
						<div className="w-10 h-10 bg-[#e8f4ee] rounded-xl flex items-center justify-center mx-auto mb-2">
							<Heart className="w-5 h-5 text-[#7b9e87]" />
						</div>
						<p className="text-2xl md:text-4xl font-bold text-[#1a365d]">1</p>
						<p className="text-xs text-muted-foreground">Item Donated</p>
					</Card>
					<Card className="p-4 text-center border-[#e8f4ee] shadow-sm">
						<div className="w-10 h-10 bg-[#e8f4ee] rounded-xl flex items-center justify-center mx-auto mb-2">
							<Star className="w-5 h-5 text-[#7b9e87]" />
						</div>
						<p className="text-2xl md:text-4xl font-bold text-[#1a365d]">50</p>
						<p className="text-xs text-muted-foreground">Points Earned</p>
					</Card>
				</div>

				{/* Email Notification */}
				<div className="bg-[#e8f4ee]/50 border border-[#7b9e87]/20 rounded-2xl p-4 flex items-start gap-3 mb-8">
					<div className="w-8 h-8 bg-[#7b9e87]/20 rounded-lg flex items-center justify-center shrink-0">
						<Mail className="w-4 h-4 text-[#7b9e87]" />
					</div>
					<div>
						<p className="text-sm font-semibold text-[#1a365d]">
							Confirmation email sent!
						</p>
						<p className="text-xs text-[#1a365d]/70 mt-1">
							Check your inbox for the donation receipt and reward details.
						</p>
					</div>
				</div>

				{/* Actions */}
				<div className="space-y-3">
					<Button
						size="lg"
						className="w-full h-14 text-base font-semibold rounded-xl bg-linear-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all"
						onClick={() => router.push("/items")}
					>
						Browse Available Items
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="w-full h-12 text-base font-medium rounded-xl border-2 border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee] text-[#1a365d]"
						onClick={() => router.push("/donate")}
					>
						<RotateCcw className="w-4 h-4 mr-2" />
						Donate Another Item
					</Button>
					<Button
						variant="ghost"
						size="lg"
						className="w-full h-12 text-base font-medium text-[#1a365d] hover:bg-[#e8f4ee]"
						onClick={() => router.push("/")}
					>
						<Home className="w-4 h-4 mr-2" />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
}
