"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mockItems, pickupPoints } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
	ArrowLeft,
	Truck,
	MapPin,
	Phone,
	Gift,
	User,
	PackageX,
	CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DeliveryMethod, PickupPoint } from "@/types/donation";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export function ClaimItem() {
	const params = useParams();
	const id = params.id as string;
	const router = useRouter();
	const item = mockItems.find((i) => i.id === id);

	const [method, setMethod] = useState<DeliveryMethod>("pickup");
	const [pickupPoint, setPickupPoint] = useState<PickupPoint>("canteen");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [loading, setLoading] = useState(false);

	if (!item) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[#f8faf9]">
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!phone.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}

		if (method === "delivery" && !address.trim()) {
			toast.error("Please enter your delivery address");
			return;
		}

		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			router.push(
				`/claim/success?id=${id}&method=${method}&point=${pickupPoint}`,
			);
		}, 1500);
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
								Claim Item
							</h1>
						</div>
						<p className="text-sm text-muted-foreground">
							Complete the form to reserve this item
						</p>
					</div>
				</div>

				{/* Item Preview */}
				<Card className="p-4 mb-6 border-[#e8f4ee] shadow-sm">
					<div className="flex gap-4">
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
							<p className="text-sm text-[#7b9e87] mt-1 font-medium">
								{item.condition}
							</p>
						</div>
					</div>
				</Card>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Delivery Method */}
					<div className="space-y-3">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
								<Truck className="w-4 h-4 text-[#7b9e87]" />
							</div>
							<Label className="text-base font-semibold text-[#1a365d]">
								Choose Delivery Method
							</Label>
						</div>
						<RadioGroup
							value={method}
							onValueChange={(v: string) => setMethod(v as DeliveryMethod)}
						>
							<Card
								className={`p-4 cursor-pointer border-2 transition-all ${
									method === "pickup"
										? "border-[#7b9e87] bg-[#e8f4ee]/30"
										: "border-[#e8f4ee] hover:border-[#7b9e87]/50"
								}`}
							>
								<div className="flex items-start gap-3">
									<RadioGroupItem value="pickup" id="pickup" className="mt-1" />
									<div className="flex-1" onClick={() => setMethod("pickup")}>
										<div className="flex items-center gap-2 mb-1">
											<MapPin className="w-4 h-4 text-[#7b9e87]" />
											<Label
												htmlFor="pickup"
												className="cursor-pointer font-semibold text-[#1a365d]"
											>
												Pick Up at Point
											</Label>
										</div>
										<p className="text-sm text-muted-foreground">
											Collect from designated locations
										</p>
									</div>
								</div>
							</Card>

							<Card
								className={`p-4 cursor-pointer border-2 transition-all ${
									method === "delivery"
										? "border-[#7b9e87] bg-[#e8f4ee]/30"
										: "border-[#e8f4ee] hover:border-[#7b9e87]/50"
								}`}
							>
								<div className="flex items-start gap-3">
									<RadioGroupItem
										value="delivery"
										id="delivery"
										className="mt-1"
									/>
									<div className="flex-1" onClick={() => setMethod("delivery")}>
										<div className="flex items-center gap-2 mb-1">
											<Truck className="w-4 h-4 text-[#7b9e87]" />
											<Label
												htmlFor="delivery"
												className="cursor-pointer font-semibold text-[#1a365d]"
											>
												Home Delivery
											</Label>
										</div>
										<p className="text-sm text-muted-foreground">
											Get it delivered to your address
										</p>
									</div>
								</div>
							</Card>
						</RadioGroup>
					</div>

					{/* Pickup Point Selection */}
					{method === "pickup" && (
						<div className="space-y-3">
							<div className="flex items-center gap-2 mb-4">
								<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
									<MapPin className="w-4 h-4 text-[#7b9e87]" />
								</div>
								<Label className="text-base font-semibold text-[#1a365d]">
									Select Pickup Point
								</Label>
							</div>
							<RadioGroup
								value={pickupPoint}
								onValueChange={(v: string) => setPickupPoint(v as PickupPoint)}
							>
								{pickupPoints.map((point) => (
									<Card
										key={point.id}
										className={`p-4 cursor-pointer border-2 transition-all ${
											pickupPoint === point.id
												? "border-[#7b9e87] bg-[#e8f4ee]/30"
												: "border-[#e8f4ee] hover:border-[#7b9e87]/50"
										}`}
									>
										<div className="flex items-start gap-3">
											<RadioGroupItem
												value={point.id}
												id={point.id}
												className="mt-1"
											/>
											<div
												className="flex-1"
												onClick={() => setPickupPoint(point.id as PickupPoint)}
											>
												<Label
													htmlFor={point.id}
													className="cursor-pointer mb-1 block font-semibold text-[#1a365d]"
												>
													{point.name}
												</Label>
												<p className="text-sm text-muted-foreground">
													{point.address}
												</p>
												<p className="text-xs text-[#7b9e87] mt-1 font-medium">
													Hours: {point.hours}
												</p>
											</div>
										</div>
									</Card>
								))}
							</RadioGroup>
						</div>
					)}

					{/* Personal Information */}
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
								<User className="w-4 h-4 text-[#7b9e87]" />
							</div>
							<h3 className="text-base font-semibold text-[#1a365d]">
								Your Contact Information
							</h3>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="claim-phone"
								className="flex items-center gap-2 text-[#1a365d]"
							>
								<Phone className="w-4 h-4 text-[#7b9e87]" />
								Phone Number
							</Label>
							<Input
								id="claim-phone"
								type="tel"
								placeholder="+62 812 3456 7890"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="h-12 bg-white border-[#e8f4ee] focus:border-[#7b9e87] focus:ring-[#7b9e87]"
								required
							/>
						</div>

						{method === "delivery" && (
							<div className="space-y-2">
								<Label htmlFor="claim-address" className="text-[#1a365d]">
									Delivery Address
								</Label>
								<Textarea
									id="claim-address"
									placeholder="Enter your complete address"
									value={address}
									onChange={(e) => setAddress(e.target.value)}
									rows={3}
									className="bg-white border-[#e8f4ee] focus:border-[#7b9e87] focus:ring-[#7b9e87]"
									required
								/>
							</div>
						)}
					</div>

					{/* Submit Button */}
					<Button
						type="submit"
						size="lg"
						className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all"
						disabled={loading}
					>
						{loading ? (
							<span className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5 animate-spin" />
								Processing...
							</span>
						) : (
							<span className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								Confirm Claim
							</span>
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}
