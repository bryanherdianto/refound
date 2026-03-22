"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
	QrCode,
	Package,
	Camera,
	Box,
	User,
	Gift,
	CheckCircle2,
	Sparkles,
	Leaf,
	ArrowRight,
} from "lucide-react";

const steps = [
	{
		icon: Package,
		title: "Choose Item Size",
		desc: "Select whether your item is small or big to get started",
	},
	{
		icon: Camera,
		title: "Take Photos",
		desc: "For big items, snap photos of front and back views",
	},
	{
		icon: Box,
		title: "Insert Your Item",
		desc: "Place your item into the smart donation box",
	},
	{
		icon: User,
		title: "Enter Your Details",
		desc: "Provide your name and email to receive donation rewards",
	},
	{
		icon: Gift,
		title: "Get Your Reward!",
		desc: "Earn points and recognition for your contribution",
	},
];

const benefits = [
	{
		icon: Sparkles,
		title: "Earn Rewards",
		desc: "Get points for every donation you make",
	},
	{
		icon: CheckCircle2,
		title: "AI Verification",
		desc: "Smart technology validates your items instantly",
	},
	{
		icon: Leaf,
		title: "Track Impact",
		desc: "See how your donations help the community",
	},
];

export function DonateInstructions() {
	const router = useRouter();

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-8 md:py-12 max-w-2xl">
				{/* Header */}
				<div className="text-center space-y-4 mb-10 md:mb-12">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f4ee] text-[#1a365d] rounded-full text-sm font-medium mb-2">
						<QrCode className="w-4 h-4 text-[#7b9e87]" />
						Smart Donation
					</div>
					<h1 className="text-3xl md:text-4xl font-semibold text-[#1a365d] tracking-tight">
						Make a Difference Today
					</h1>
					<p className="text-lg text-muted-foreground max-w-md mx-auto">
						Your unused items can change someone&apos;s life. Follow these
						simple steps to donate.
					</p>
				</div>

				{/* How to Donate Steps */}
				<div className="mb-12">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
							<Box className="w-4 h-4 text-[#7b9e87]" />
						</div>
						<h2 className="text-xl font-semibold text-[#1a365d]">
							How to Donate
						</h2>
					</div>

					<div className="space-y-4">
						{steps.map((step, index) => (
							<Card
								key={step.title}
								className="p-5 border-[#e8f4ee] hover:border-[#7b9e87]/30 hover:shadow-md transition-all duration-300 group"
							>
								<div className="flex gap-4">
									<div className="relative shrink-0">
										<div className="w-12 h-12 bg-[#e8f4ee] rounded-2xl flex items-center justify-center group-hover:bg-[#7b9e87] group-hover:text-white transition-colors duration-300">
											<step.icon className="w-6 h-6 text-[#7b9e87] group-hover:text-white transition-colors duration-300" />
										</div>
										<div className="absolute -top-2 -left-2 w-6 h-6 bg-[#7b9e87] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
											{index + 1}
										</div>
									</div>
									<div className="flex-1 pt-1">
										<h3 className="text-base font-semibold text-[#1a365d] mb-1">
											{step.title}
										</h3>
										<p className="text-sm text-muted-foreground leading-relaxed">
											{step.desc}
										</p>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Why Donate Section */}
				<div className="bg-gradient-to-br from-[#e8f4ee] to-[#f0f4f1] border border-[#7b9e87]/20 rounded-3xl p-6 md:p-8 mb-8">
					<div className="flex items-center gap-3 mb-6">
						<div className="w-8 h-8 bg-[#7b9e87] rounded-lg flex items-center justify-center">
							<Gift className="w-4 h-4 text-white" />
						</div>
						<h2 className="text-xl font-semibold text-[#1a365d]">
							Why Donate?
						</h2>
					</div>

					<div className="space-y-4">
						{benefits.map((benefit) => (
							<div key={benefit.title} className="flex items-start gap-4">
								<div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
									<benefit.icon className="w-5 h-5 text-[#7b9e87]" />
								</div>
								<div>
									<h3 className="text-sm font-semibold text-[#1a365d] mb-0.5">
										{benefit.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{benefit.desc}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* CTA Section */}
				<div className="space-y-4">
					<Button
						size="lg"
						className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0"
						onClick={() => router.push("/donate/size")}
					>
						Start Donating
						<ArrowRight className="w-5 h-5 ml-2" />
					</Button>

					<Button
						variant="ghost"
						size="lg"
						onClick={() => router.push("/items")}
						className="w-full h-12 text-base text-[#1a365d] hover:bg-[#e8f4ee]"
					>
						Browse Available Items
					</Button>
				</div>
			</div>
		</div>
	);
}
