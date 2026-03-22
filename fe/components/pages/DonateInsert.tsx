"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
	Package,
	Loader2,
	CheckCircle,
	Sparkles,
	XCircle,
} from "lucide-react";
import { useDonation } from "@/contexts/DonationContext";
import { esp32Capture } from "@/lib/api";
import { toast } from "sonner";

type InsertStatus = "waiting" | "detecting" | "detected" | "rejected";

export function DonateInsert() {
	const router = useRouter();
	const { size, setEspItemId } = useDonation();

	const [status, setStatus] = useState<InsertStatus>("waiting");
	const [detectedName, setDetectedName] = useState("");

	const handleInsert = async () => {
		setStatus("detecting");

		try {
			const result = await esp32Capture();

			if (result.success && result.accepted) {
				setDetectedName(result.name || "Item");
				setEspItemId(result.item_id || null);
				setStatus("detected");
				toast.success(`Detected: ${result.name}`);

				// Navigate to form after a brief celebration
				setTimeout(() => {
					router.push(`/donate/form?size=${size}`);
				}, 2000);
			} else if (result.success && !result.accepted) {
				setStatus("rejected");
				toast.error(result.reason || "Item was not accepted");
			} else {
				setStatus("waiting");
				toast.error(result.error || "Capture failed. Please try again.");
			}
		} catch (error) {
			setStatus("waiting");
			const msg =
				error instanceof Error ? error.message : "Connection error";
			toast.error(msg);
		}
	};

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-6 max-w-2xl">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<Sparkles className="w-5 h-5 text-[#7b9e87]" />
							<h1 className="text-xl md:text-2xl font-semibold text-[#1a365d]">
								Insert Your Item
							</h1>
						</div>
						<p className="text-sm text-muted-foreground">
							Step 2 of 3 • Place your item in the donation box
						</p>
					</div>
				</div>

				{/* Insert Animation */}
				<div className="bg-linear-to-br from-[#e8f4ee] to-[#f0f4f1] rounded-3xl p-8 md:p-12 mb-8 border border-[#e8f4ee] shadow-sm">
					<div className="text-center space-y-6">
						{status === "waiting" && (
							<>
								<div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#7b9e87]/10">
									<Package className="w-12 h-12 text-[#7b9e87]" />
								</div>
								<div>
									<h2 className="text-xl md:text-2xl font-semibold text-[#1a365d] mb-2">
										Ready to Insert
									</h2>
									<p className="text-muted-foreground">
										Place your item into the donation box opening
									</p>
								</div>
							</>
						)}

						{status === "detecting" && (
							<>
								<div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#7b9e87]/10">
									<Loader2 className="w-12 h-12 text-[#7b9e87] animate-spin" />
								</div>
								<div>
									<h2 className="text-xl md:text-2xl font-semibold text-[#1a365d] mb-2">
										Detecting Item...
									</h2>
									<p className="text-muted-foreground">
										ESP32 camera is capturing and AI is analyzing
									</p>
								</div>
							</>
						)}

						{status === "detected" && (
							<>
								<div className="w-24 h-24 bg-linear-to-br from-[#7b9e87] to-[#6a8a75] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#7b9e87]/30">
									<CheckCircle className="w-12 h-12 text-white" />
								</div>
								<div>
									<h2 className="text-xl md:text-2xl font-semibold text-[#7b9e87] mb-2">
										{detectedName} Received!
									</h2>
									<p className="text-muted-foreground">
										Moving to next step...
									</p>
								</div>
							</>
						)}

						{status === "rejected" && (
							<>
								<div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-100">
									<XCircle className="w-12 h-12 text-red-500" />
								</div>
								<div>
									<h2 className="text-xl md:text-2xl font-semibold text-red-600 mb-2">
										Item Not Accepted
									</h2>
									<p className="text-muted-foreground">
										The item doesn&apos;t appear eligible for donation. Please
										try a different item.
									</p>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Instructions */}
				{(status === "waiting" || status === "rejected") && (
					<div className="space-y-4 mb-8">
						<div className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
								<Package className="w-4 h-4 text-[#7b9e87]" />
							</div>
							<h3 className="text-base font-semibold text-[#1a365d]">
								Instructions
							</h3>
						</div>
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0 mt-0.5">
									<span className="text-xs font-bold text-[#7b9e87]">1</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Locate the donation box opening
								</p>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0 mt-0.5">
									<span className="text-xs font-bold text-[#7b9e87]">2</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Gently place your item inside
								</p>
							</div>
							<div className="flex items-start gap-3">
								<div className="w-6 h-6 bg-[#e8f4ee] rounded-full flex items-center justify-center shrink-0 mt-0.5">
									<span className="text-xs font-bold text-[#7b9e87]">3</span>
								</div>
								<p className="text-sm text-muted-foreground">
									Click the button below and wait for AI detection
								</p>
							</div>
						</div>
					</div>
				)}

				{/* CTA */}
				{(status === "waiting" || status === "rejected") && (
					<div className="space-y-4">
						<Button
							size="lg"
							className="w-full h-14 text-base font-semibold rounded-xl bg-linear-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all"
							onClick={handleInsert}
						>
							<span className="flex items-center gap-2">
								<Package className="w-5 h-5" />
								{status === "rejected"
									? "Try Again"
									: "I've Inserted the Item"}
							</span>
						</Button>
						<p className="text-xs text-center text-muted-foreground">
							Click this button after inserting your item
						</p>
					</div>
				)}

				{/* Processing indicator */}
				{status === "detecting" && (
					<div className="text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-sm font-medium">
							<span className="w-2 h-2 bg-[#7b9e87] rounded-full animate-pulse"></span>
							ESP32 capturing &amp; analyzing...
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
