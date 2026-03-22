"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
	Package,
	Box,
	ArrowRight,
	Gift,
	Sparkles,
	Lightbulb,
} from "lucide-react";

export function DonateSize() {
	const router = useRouter();

	const handleSelectSize = (size: "small" | "big") => {
		if (size === "small") {
			router.push("/donate/insert?size=small");
		} else {
			router.push("/donate/photo?size=big");
		}
	};

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-6 max-w-2xl">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<Gift className="w-5 h-5 text-[#7b9e87]" />
							<h1 className="text-xl md:text-2xl font-semibold text-[#1a365d]">
								Choose Item Size
							</h1>
						</div>
						<p className="text-sm text-muted-foreground">
							Select the size of your donation
						</p>
					</div>
				</div>

				{/* Introduction */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f4ee] text-[#1a365d] rounded-full text-sm font-medium mb-4">
						<Sparkles className="w-4 h-4 text-[#7b9e87]" />
						Step 1 of 3
					</div>
					<p className="text-muted-foreground">
						Select the size of the item you want to donate. This helps us
						process your donation efficiently.
					</p>
				</div>

				<div className="space-y-4">
					{/* Small Size */}
					<Card
						className="p-6 cursor-pointer border-[#e8f4ee] hover:border-[#7b9e87] hover:shadow-lg hover:shadow-[#7b9e87]/10 transition-all group"
						onClick={() => handleSelectSize("small")}
					>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-[#e8f4ee] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#7b9e87] transition-colors">
								<Package className="w-8 h-8 text-[#7b9e87] group-hover:text-white transition-colors" />
							</div>
							<div className="flex-1">
								<div className="flex items-center justify-between mb-1">
									<h3 className="text-lg font-semibold text-[#1a365d]">
										Small Item
									</h3>
									<ArrowRight className="w-5 h-5 text-[#7b9e87] opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<p className="text-sm text-muted-foreground mb-3">
									Pens, earphones, small toys, cables, accessories, etc.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="text-xs bg-[#e8f4ee] text-[#7b9e87] px-2.5 py-1 rounded-full font-medium">
										No photo needed
									</span>
									<span className="text-xs bg-[#e8f4ee] text-[#7b9e87] px-2.5 py-1 rounded-full font-medium">
										Quick process
									</span>
								</div>
							</div>
						</div>
					</Card>

					{/* Big Size */}
					<Card
						className="p-6 cursor-pointer border-[#e8f4ee] hover:border-orange-400 hover:shadow-lg hover:shadow-orange-100 transition-all group"
						onClick={() => handleSelectSize("big")}
					>
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-100 transition-colors">
								<Box className="w-8 h-8 text-orange-600" />
							</div>
							<div className="flex-1">
								<div className="flex items-center justify-between mb-1">
									<h3 className="text-lg font-semibold text-[#1a365d]">
										Big Item
									</h3>
									<ArrowRight className="w-5 h-5 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
								</div>
								<p className="text-sm text-muted-foreground mb-3">
									Backpacks, teddy bears, books, bottles, clothing, etc.
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
										Photos required
									</span>
									<span className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
										Front & back
									</span>
								</div>
							</div>
						</div>
					</Card>
				</div>

				{/* Info */}
				<div className="mt-8 bg-[#e8f4ee]/50 border border-[#7b9e87]/20 rounded-2xl p-4">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-[#7b9e87]/20 rounded-lg flex items-center justify-center shrink-0">
							<Lightbulb className="w-5 h-5 text-[#7b9e87]" />
						</div>
						<div>
							<p className="text-sm font-semibold text-[#1a365d] mb-1">
								Why photos for big items?
							</p>
							<p className="text-sm text-[#1a365d]/70">
								Big items require photos to help us verify the condition before
								donation, ensuring quality for recipients.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
