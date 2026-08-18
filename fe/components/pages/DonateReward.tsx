"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
	Gift,
	CheckCircle,
	Home,
	RotateCcw,
	Sparkles,
} from "lucide-react";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { useDonation } from "@/contexts/DonationContext";

export function DonateReward() {
	const router = useRouter();
	const { createdItem, reset } = useDonation();

	const itemName = createdItem?.name || "Your Item";

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
							<span className="text-muted-foreground">Item</span>
							<span className="font-medium text-[#1a365d]">{itemName}</span>
						</div>
						{createdItem?.category && (
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Category</span>
								<span className="font-medium text-[#1a365d] capitalize">
									{createdItem.category}
								</span>
							</div>
						)}
						{createdItem?.condition && (
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Condition</span>
								<span className="font-medium text-[#1a365d]">
									{createdItem.condition}
								</span>
							</div>
						)}
					</div>
				</Card>

				{/* Actions */}
				<div className="space-y-3">
					<Button
						size="lg"
						className="w-full h-14 text-base font-semibold rounded-xl bg-linear-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all"
						onClick={() => {
							reset();
							router.push("/items");
						}}
					>
						Browse Available Items
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="w-full h-12 text-base font-medium rounded-xl border-2 border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee] text-[#1a365d]"
						onClick={() => {
							reset();
							router.push("/donate");
						}}
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
