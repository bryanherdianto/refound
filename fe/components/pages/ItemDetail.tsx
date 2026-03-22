"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { mockItems } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, PackageX } from "lucide-react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function ItemDetail() {
	const params = useParams();
	const id = params.id as string;
	const router = useRouter();
	const item = mockItems.find((i) => i.id === id);

	const [activeImage, setActiveImage] = useState(item?.image || "");

	useEffect(() => {
		if (item) setActiveImage(item.image);
	}, [item]);

	if (!item) {
		return (
			<div className="flex items-center justify-center bg-[#f8faf9]">
				<div className="text-center p-8">
					<div className="w-20 h-20 bg-[#e8f4ee] rounded-full flex items-center justify-center mx-auto mb-6">
						<PackageX className="w-10 h-10 text-[#7b9e87]" />
					</div>
					<h2 className="text-xl font-semibold text-[#1a365d] mb-2">
						Item Not Found
					</h2>
					<p className="text-muted-foreground mb-6">
						The item you&apos;re looking for doesn&apos;t exist or has been
						removed.
					</p>
					<Button
						onClick={() => router.push("/items")}
						className="bg-[#7b9e87] hover:bg-[#6a8a75] text-white"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Items
					</Button>
				</div>
			</div>
		);
	}

	const handleClaim = () => {
		router.push(`/claim/${id}`);
	};

	const isAvailable = item.status === "available";

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
					{/* Left Column: Image Area */}
					<div className="space-y-6">
						<div className="aspect-square relative rounded-3xl overflow-hidden bg-[#f0f4f1] shadow-[0_8px_30px_-5px_rgba(26,54,93,0.1)] border border-[#e8f4ee]">
							<ImageWithFallback
								src={activeImage}
								alt={item.name}
								className="w-full h-full object-cover transition-transform duration-500"
								key={activeImage}
							/>
						</div>

						{/* Additional Photos for Big Items */}
						{item.size === "big" && item.frontImage && item.backImage && (
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<p className="text-xs font-medium text-[#7b9e87] ml-1 uppercase tracking-wider">
										Front View
									</p>
									<button
										onClick={() => setActiveImage(item.frontImage!)}
										className={`aspect-4/3 w-full rounded-2xl overflow-hidden border transition-all ${
											activeImage === item.frontImage
												? "border-[#7b9e87] ring-2 ring-[#7b9e87]/20 shadow-md"
												: "border-[#e8f4ee] opacity-70 hover:opacity-100"
										}`}
									>
										<ImageWithFallback
											src={item.frontImage}
											alt="Front view"
											className="w-full h-full object-cover"
										/>
									</button>
								</div>
								<div className="space-y-2">
									<p className="text-xs font-medium text-[#7b9e87] ml-1 uppercase tracking-wider">
										Back View
									</p>
									<button
										onClick={() => setActiveImage(item.backImage!)}
										className={`aspect-4/3 w-full rounded-2xl overflow-hidden border transition-all ${
											activeImage === item.backImage
												? "border-[#7b9e87] ring-2 ring-[#7b9e87]/20 shadow-md"
												: "border-[#e8f4ee] opacity-70 hover:opacity-100"
										}`}
									>
										<ImageWithFallback
											src={item.backImage}
											alt="Back view"
											className="w-full h-full object-cover"
										/>
									</button>
								</div>
							</div>
						)}
					</div>

					{/* Right Column: Detailed Information */}
					<div className="flex flex-col h-full space-y-8 py-2">
						<div>
							<div className="inline-flex items-center gap-2 px-3 py-1 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-xs font-medium mb-3 capitalize">
								{item.category}
							</div>
							<h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-semibold tracking-tight text-[#1a365d]">
								{item.name}
							</h1>
						</div>

						<div className="space-y-6">
							{/* Condition Section */}
							<div className="bg-[#e8f4ee]/50 border border-[#7b9e87]/20 rounded-2xl p-5 flex items-start gap-4">
								<div className="h-10 w-10 bg-[#7b9e87]/20 rounded-full flex items-center justify-center shrink-0">
									<CheckCircle className="w-5 h-5 text-[#7b9e87]" />
								</div>
								<div>
									<p className="text-sm font-semibold text-[#1a365d]">
										Item Condition
									</p>
									<p className="text-sm text-[#1a365d]/70 mt-1 leading-relaxed">
										This item has been inspected and categorized as{" "}
										<span className="font-semibold text-[#7b9e87]">
											&quot;{item.condition}&quot;
										</span>
										.
									</p>
								</div>
							</div>

							{/* Technical Details */}
							<div className="border border-[#e8f4ee] rounded-2xl p-6 bg-white shadow-sm space-y-4">
								<h3 className="text-sm font-bold uppercase tracking-widest text-[#7b9e87] mb-2">
									Detailed Specifications
								</h3>
								<div className="space-y-4">
									<div className="flex justify-between items-center py-1 border-b border-[#e8f4ee]">
										<span className="text-sm text-muted-foreground">
											Donation Date
										</span>
										<span
											className="text-sm font-medium text-[#1a365d]"
											suppressHydrationWarning
										>
											{new Date(item.detectedAt).toLocaleDateString()}
										</span>
									</div>
									<div className="flex justify-between items-center py-1 border-b border-[#e8f4ee]">
										<span className="text-sm text-muted-foreground">
											Volume Category
										</span>
										<span className="text-sm font-medium text-[#1a365d] capitalize">
											{item.size}
										</span>
									</div>
									<div className="flex justify-between items-center py-1 border-b border-[#e8f4ee]">
										<span className="text-sm text-muted-foreground">
											Original Donor
										</span>
										<span className="text-sm font-medium text-[#1a365d]">
											{item.donorName || "Verified Contributor"}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Desktop-only action button (hidden on mobile, shown on md+) */}
						<div className="hidden md:block pt-4 mt-auto">
							{isAvailable ? (
								<Button
									className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0"
									onClick={handleClaim}
								>
									Claim This Item
								</Button>
							) : (
								<Button
									className="w-full h-14 text-lg font-semibold rounded-2xl bg-[#e8f4ee] text-[#1a365d] cursor-not-allowed"
									disabled
								>
									{item.status === "claimed"
										? "Successfully Claimed"
										: "Currently Unavailable"}
								</Button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Mobile-only Bottom CTA (hidden on desktop) */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#e8f4ee] p-4 z-40">
				<div className="container mx-auto">
					{isAvailable ? (
						<Button
							className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg"
							onClick={handleClaim}
						>
							Claim This Item
						</Button>
					) : (
						<Button
							className="w-full h-12 text-base bg-[#e8f4ee] text-[#1a365d] cursor-not-allowed"
							disabled
						>
							{item.status === "claimed" ? "Already Claimed" : "Not Available"}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
