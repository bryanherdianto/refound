"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, MapPin, Truck, Clock, Home } from "lucide-react";
import { pickupPoints } from "@/lib/constants";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DonationItem, getPickupPointLabel } from "@/types/donation";
import { fetchItem } from "@/lib/api";

export function ClaimSuccess() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const itemId = searchParams.get("id");

	const [item, setItem] = useState<DonationItem | null>(null);
	// Nothing to load without an id, so start settled in that case.
	const [isLoading, setIsLoading] = useState(Boolean(itemId));

	useEffect(() => {
		if (!itemId) return;

		let cancelled = false;

		fetchItem(itemId)
			.then((data) => {
				if (!cancelled) setItem(data);
			})
			.catch(() => {
				if (!cancelled) setItem(null);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [itemId]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-32">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7b9e87] border-t-transparent"></div>
			</div>
		);
	}

	// Everything below is driven by the claim the backend actually recorded.
	const claim = item?.claimedBy;
	const method = claim?.method;
	const pickupLocation = pickupPoints.find((p) => p.id === claim?.pickupPoint);

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				{/* Success Icon */}
				<div className="text-center mb-8">
					<div className="w-24 h-24 bg-linear-to-br from-[#7b9e87] to-[#6a8a75] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#7b9e87]/30 mb-6">
						<CheckCircle className="w-12 h-12 text-white" />
					</div>
					<h1 className="text-2xl md:text-3xl font-bold text-[#1a365d] mb-2">
						Claim Successful!
					</h1>
					<p className="text-muted-foreground">
						Your item has been reserved for you
					</p>
				</div>

				{/* Item Info */}
				{item && (
					<Card className="p-6 mb-6 border-[#e8f4ee] shadow-sm">
						<div className="flex gap-4 mb-4">
							<div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f0f4f1] shrink-0">
								<ImageWithFallback
									src={item.image}
									alt={item.name}
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-[#1a365d]">{item.name}</h3>
								<p className="text-sm text-muted-foreground capitalize">
									{item.category}
								</p>
							</div>
						</div>
						<div className="pt-4 border-t border-[#e8f4ee] space-y-3">
							<div className="flex justify-between text-sm">
								<span className="text-muted-foreground">Status</span>
								<span className="font-semibold text-[#7b9e87] capitalize">
									{item.status}
								</span>
							</div>
							<div className="flex justify-between text-sm gap-4">
								<span className="text-muted-foreground shrink-0">
									Reference ID
								</span>
								<span className="font-mono text-xs text-[#1a365d] break-all text-right">
									{item.id}
								</span>
							</div>
							{claim?.claimedAt && (
								<div className="flex justify-between text-sm">
									<span className="text-muted-foreground">Claimed On</span>
									<span className="font-semibold text-[#1a365d]">
										{new Date(claim.claimedAt).toLocaleString()}
									</span>
								</div>
							)}
						</div>
					</Card>
				)}

				{/* Delivery Details */}
				<Card className="p-6 mb-6 border-[#e8f4ee] shadow-sm">
					<h3 className="text-base font-semibold text-[#1a365d] mb-4 flex items-center gap-2">
						{method === "pickup" ? (
							<>
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
									<MapPin className="w-4 h-4 text-[#7b9e87]" />
								</div>
								Pickup Details
							</>
						) : (
							<>
								<div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
									<Truck className="w-4 h-4 text-blue-600" />
								</div>
								Delivery Details
							</>
						)}
					</h3>

					{method === "pickup" ? (
						<div className="space-y-4">
							<div className="bg-[#f8faf9] rounded-xl p-4">
								<p className="text-sm text-muted-foreground mb-1">Location</p>
								<p className="font-semibold text-[#1a365d]">
									{pickupLocation
										? pickupLocation.name
										: claim?.pickupPoint
											? getPickupPointLabel(claim.pickupPoint)
											: "-"}
								</p>
							</div>
							<div className="flex items-center gap-2 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
								<Clock className="w-5 h-5 text-orange-600" />
								<span className="text-sm font-medium text-orange-700">
									Waiting for pickup
								</span>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl">
							<Truck className="w-5 h-5 text-blue-600" />
							<span className="text-sm font-medium text-blue-700">
								Processing delivery
							</span>
						</div>
					)}
				</Card>

				{/* Next Steps */}
				<Card className="p-6 mb-6 border-[#e8f4ee] shadow-sm">
					<h3 className="text-base font-semibold text-[#1a365d] mb-4">
						Next Steps
					</h3>
					{method === "pickup" ? (
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0">
									<span className="text-xs font-bold text-[#7b9e87]">1</span>
								</div>
								<p className="text-sm text-muted-foreground pt-1.5">
									Visit the pickup location to collect your item
								</p>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0">
									<span className="text-xs font-bold text-[#7b9e87]">2</span>
								</div>
								<p className="text-sm text-muted-foreground pt-1.5">
									Show your Reference ID to collect the item
								</p>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0">
									<span className="text-xs font-bold text-[#7b9e87]">3</span>
								</div>
								<p className="text-sm text-muted-foreground pt-1.5">
									Follow the status of your claim on the tracking page
								</p>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0">
									<span className="text-xs font-bold text-[#7b9e87]">1</span>
								</div>
								<p className="text-sm text-muted-foreground pt-1.5">
									Your delivery address has been recorded with the claim
								</p>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0">
									<span className="text-xs font-bold text-[#7b9e87]">2</span>
								</div>
								<p className="text-sm text-muted-foreground pt-1.5">
									Follow the status of your claim on the tracking page
								</p>
							</div>
						</div>
					)}
				</Card>

				{/* Actions */}
				<div className="space-y-3">
					<Button
						size="lg"
						className="w-full h-12 text-base font-semibold rounded-xl bg-linear-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all"
						onClick={() => router.push("/tracking")}
					>
						Track My Claim
					</Button>
					<Button
						variant="outline"
						size="lg"
						className="w-full h-12 text-base font-medium rounded-xl border-2 border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee] text-[#1a365d]"
						onClick={() => router.push("/items")}
					>
						Browse More Items
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
