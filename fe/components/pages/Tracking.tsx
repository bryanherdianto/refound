"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
	Package,
	CheckCircle,
	MapPin,
	Truck,
	PackageOpen,
	ArrowRight,
} from "lucide-react";
import { pickupPoints } from "@/lib/constants";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { DonationItem, getPickupPointLabel } from "@/types/donation";
import { fetchTracking } from "@/lib/api";

export function Tracking() {
	const router = useRouter();
	const { user, isLoaded, isSignedIn } = useUser();

	const [claimedItems, setClaimedItems] = useState<DonationItem[]>([]);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const email = user?.primaryEmailAddress?.emailAddress;

	// Claims are looked up by the signed-in user's email, so there is nothing
	// to wait for until Clerk resolves and an email is available.
	const isLoading = !isLoaded || (!!email && !hasLoaded);

	useEffect(() => {
		if (!isLoaded || !email) return;

		let cancelled = false;

		fetchTracking(email)
			.then((data) => {
				if (cancelled) return;
				setClaimedItems(data);
				setError(null);
			})
			.catch((err) => {
				if (cancelled) return;
				setError(
					err instanceof Error ? err.message : "Could not load your claims.",
				);
			})
			.finally(() => {
				if (!cancelled) setHasLoaded(true);
			});

		return () => {
			cancelled = true;
		};
	}, [isLoaded, email]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-32">
				<div className="h-10 w-10 animate-spin rounded-full border-4 border-[#7b9e87] border-t-transparent"></div>
			</div>
		);
	}

	if (!isSignedIn) {
		return (
			<div className="text-center py-16 px-4">
				<div className="w-20 h-20 bg-[#e8f4ee] rounded-full flex items-center justify-center mx-auto mb-6">
					<PackageOpen className="w-10 h-10 text-[#7b9e87]" />
				</div>
				<h2 className="text-xl font-semibold text-[#1a365d] mb-2">
					Sign in to track your claims
				</h2>
				<p className="text-muted-foreground mb-6 max-w-md mx-auto">
					Your claimed items are tied to your account. Sign in to see their
					status.
				</p>
				<SignInButton mode="modal">
					<Button
						size="lg"
						className="h-12 px-8 text-base font-semibold rounded-xl bg-[#1a365d] hover:bg-[#152c4d] text-white border-0 shadow-lg"
					>
						Sign In
					</Button>
				</SignInButton>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-16 px-4">
				<div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
					<PackageOpen className="w-10 h-10 text-red-500" />
				</div>
				<h2 className="text-xl font-semibold text-[#1a365d] mb-2">
					Couldn&apos;t load your claims
				</h2>
				<p className="text-muted-foreground max-w-md mx-auto">{error}</p>
			</div>
		);
	}

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-6 max-w-4xl">
				{claimedItems.length > 0 ? (
					<div className="space-y-6">
						{claimedItems.map((item) => {
							const pickupLocation = pickupPoints.find(
								(p) => p.id === item.claimedBy?.pickupPoint,
							);
							const isPickedUp = !!item.claimedBy?.pickedUpAt;
							const pickupName = pickupLocation
								? pickupLocation.name
								: item.claimedBy?.pickupPoint
									? getPickupPointLabel(item.claimedBy.pickupPoint)
									: null;

							return (
								<Card
									key={item.id}
									className="p-5 md:p-6 border-[#e8f4ee] shadow-sm hover:shadow-md transition-shadow"
								>
									{/* Item Header */}
									<div className="flex gap-4 mb-6">
										<div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f0f4f1] shrink-0">
											<ImageWithFallback
												src={item.image}
												alt={item.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1">
											<h3 className="font-semibold text-[#1a365d] mb-1">
												{item.name}
											</h3>
											<p className="text-sm text-muted-foreground mb-2 capitalize">
												{item.category}
											</p>
											<Badge
												className={
													isPickedUp
														? "bg-[#e8f4ee] text-[#7b9e87] border-[#7b9e87]/20"
														: "bg-orange-50 text-orange-600 border-orange-200"
												}
											>
												{isPickedUp ? "Picked Up" : "Waiting for Pickup"}
											</Badge>
										</div>
									</div>

									{/* Claim Info */}
									<div className="space-y-6">
										<div className="grid grid-cols-2 gap-4 text-sm bg-[#f8faf9] rounded-xl p-4">
											<div>
												<p className="text-muted-foreground mb-1">Claimed By</p>
												<p className="font-semibold text-[#1a365d]">
													{item.claimedBy?.name}
												</p>
											</div>
											<div>
												<p className="text-muted-foreground mb-1">Claimed On</p>
												<p className="font-semibold text-[#1a365d]">
													{item.claimedBy?.claimedAt
														? new Date(
																item.claimedBy.claimedAt,
															).toLocaleDateString()
														: "-"}
												</p>
											</div>
										</div>

										{/* Pickup Details */}
										{item.claimedBy?.method === "pickup" && pickupName && (
											<div className="bg-[#e8f4ee]/50 border border-[#7b9e87]/20 rounded-2xl p-5">
												<div className="flex items-start gap-3">
													<div className="w-10 h-10 bg-[#7b9e87] rounded-full flex items-center justify-center shrink-0">
														<MapPin className="w-5 h-5 text-white" />
													</div>
													<div className="flex-1">
														<p className="text-sm font-semibold text-[#1a365d] mb-1">
															Pickup Location
														</p>
														<p className="text-sm text-[#1a365d]/70">
															{pickupName}
														</p>
													</div>
												</div>
											</div>
										)}

										{/* Timeline */}
										<div className="pt-2">
											<h4 className="text-sm font-semibold text-[#1a365d] mb-4 flex items-center gap-2">
												<Truck className="w-4 h-4 text-[#7b9e87]" />
												Status Timeline
											</h4>
											<div className="relative space-y-6">
												{/* Connecting Line */}
												<div className="absolute left-4 top-8 bottom-8 w-0.5 bg-[#e8f4ee]"></div>

												{/* Claimed */}
												<div className="flex gap-4 relative z-10">
													<div className="w-8 h-8 bg-[#7b9e87] rounded-full flex items-center justify-center shrink-0 shadow-sm">
														<CheckCircle className="w-5 h-5 text-white" />
													</div>
													<div className="flex-1 pt-1">
														<p className="text-sm font-semibold text-[#1a365d]">
															Claimed
														</p>
														<p className="text-xs text-muted-foreground">
															{item.claimedBy?.claimedAt
																? new Date(
																		item.claimedBy.claimedAt,
																	).toLocaleString()
																: "-"}
														</p>
													</div>
												</div>

												{/* Waiting/Picked Up */}
												<div className="flex gap-4 relative z-10">
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
															isPickedUp
																? "bg-[#7b9e87]"
																: "bg-[#e8f4ee] border-2 border-[#7b9e87]/30"
														}`}
													>
														{isPickedUp ? (
															<CheckCircle className="w-5 h-5 text-white" />
														) : (
															<Package className="w-4 h-4 text-[#7b9e87]" />
														)}
													</div>
													<div className="flex-1 pt-1">
														<p className="text-sm font-semibold text-[#1a365d]">
															{isPickedUp ? "Picked Up" : "Waiting for Pickup"}
														</p>
														{isPickedUp ? (
															<p className="text-xs text-muted-foreground">
																{item.claimedBy?.pickedUpAt
																	? new Date(
																			item.claimedBy.pickedUpAt,
																		).toLocaleString()
																	: "-"}
															</p>
														) : (
															<p className="text-xs text-muted-foreground">
																{pickupName
																	? `Please collect from ${pickupName}`
																	: "Your item is being prepared"}
															</p>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* Action Button */}
										{!isPickedUp && (
											<Button
												className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-md hover:shadow-lg transition-all"
												onClick={() => router.push(`/item/${item.id}`)}
											>
												View Item Details
												<ArrowRight className="w-4 h-4 ml-2" />
											</Button>
										)}
									</div>
								</Card>
							);
						})}
					</div>
				) : (
					<div className="text-center py-16 px-4">
						<div className="w-20 h-20 bg-[#e8f4ee] rounded-full flex items-center justify-center mx-auto mb-6">
							<PackageOpen className="w-10 h-10 text-[#7b9e87]" />
						</div>
						<h2 className="text-xl font-semibold text-[#1a365d] mb-2">
							No Claims Yet
						</h2>
						<p className="text-muted-foreground mb-6 max-w-md mx-auto">
							You haven&apos;t claimed any items yet. Browse our available items
							and make your first claim!
						</p>
						<Button
							size="lg"
							onClick={() => router.push("/items")}
							className="h-12 px-8 text-base font-semibold rounded-xl bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all"
						>
							Browse Available Items
							<ArrowRight className="w-4 h-4 ml-2" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
