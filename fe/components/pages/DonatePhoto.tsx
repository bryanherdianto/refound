"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle, Sparkles, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export function DonatePhoto() {
	const router = useRouter();
	const size = "big";

	const [frontImage, setFrontImage] = useState<string | null>(null);
	const [backImage, setBackImage] = useState<string | null>(null);

	const handleImageCapture = (side: "front" | "back") => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.capture = "environment";

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (side === "front") {
						setFrontImage(event.target?.result as string);
					} else {
						setBackImage(event.target?.result as string);
					}
				};
				reader.readAsDataURL(file);
			}
		};

		input.click();
	};

	const handleContinue = () => {
		if (!frontImage || !backImage) {
			toast.error("Please capture both front and back photos");
			return;
		}
		router.push(`/donate/insert?size=${size}`);
	};

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-6 max-w-2xl">
				{/* Header */}
				<div className="flex items-center gap-4 mb-6">
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<Camera className="w-5 h-5 text-[#7b9e87]" />
							<h1 className="text-xl md:text-2xl font-semibold text-[#1a365d]">
								Take Photos
							</h1>
						</div>
						<p className="text-sm text-muted-foreground">
							Step 2 of 3 • Big items require photo verification
						</p>
					</div>
				</div>

				<div className="space-y-6">
					{/* Front Photo */}
					<div>
						<h3 className="text-base font-semibold text-[#1a365d] mb-3 flex items-center gap-2">
							<div className="w-6 h-6 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
								<span className="text-xs font-bold text-[#7b9e87]">1</span>
							</div>
							Front View
						</h3>
						{frontImage ? (
							<Card className="p-4 relative border-[#7b9e87] bg-[#e8f4ee]/20">
								<img
									src={frontImage}
									alt="Front view"
									className="w-full h-64 object-cover rounded-xl"
								/>
								<div className="absolute top-6 right-6 bg-gradient-to-br from-[#7b9e87] to-[#6a8a75] text-white p-2 rounded-full shadow-lg">
									<CheckCircle className="w-5 h-5" />
								</div>
								<Button
									variant="outline"
									className="w-full mt-4 border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee] text-[#1a365d]"
									onClick={() => handleImageCapture("front")}
								>
									<Camera className="w-4 h-4 mr-2" />
									Retake Photo
								</Button>
							</Card>
						) : (
							<Card
								className="p-12 cursor-pointer border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee]/30 transition-all group"
								onClick={() => handleImageCapture("front")}
							>
								<div className="text-center space-y-3">
									<div className="w-16 h-16 bg-[#e8f4ee] rounded-full flex items-center justify-center mx-auto group-hover:bg-[#7b9e87] transition-colors">
										<Camera className="w-8 h-8 text-[#7b9e87] group-hover:text-white transition-colors" />
									</div>
									<p className="text-sm text-muted-foreground">
										Tap to capture front view
									</p>
								</div>
							</Card>
						)}
					</div>

					{/* Back Photo */}
					<div>
						<h3 className="text-base font-semibold text-[#1a365d] mb-3 flex items-center gap-2">
							<div className="w-6 h-6 bg-[#e8f4ee] rounded-lg flex items-center justify-center">
								<span className="text-xs font-bold text-[#7b9e87]">2</span>
							</div>
							Back View
						</h3>
						{backImage ? (
							<Card className="p-4 relative border-[#7b9e87] bg-[#e8f4ee]/20">
								<img
									src={backImage}
									alt="Back view"
									className="w-full h-64 object-cover rounded-xl"
								/>
								<div className="absolute top-6 right-6 bg-gradient-to-br from-[#7b9e87] to-[#6a8a75] text-white p-2 rounded-full shadow-lg">
									<CheckCircle className="w-5 h-5" />
								</div>
								<Button
									variant="outline"
									className="w-full mt-4 border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee] text-[#1a365d]"
									onClick={() => handleImageCapture("back")}
								>
									<Camera className="w-4 h-4 mr-2" />
									Retake Photo
								</Button>
							</Card>
						) : (
							<Card
								className="p-12 cursor-pointer border-[#e8f4ee] hover:border-[#7b9e87] hover:bg-[#e8f4ee]/30 transition-all group"
								onClick={() => handleImageCapture("back")}
							>
								<div className="text-center space-y-3">
									<div className="w-16 h-16 bg-[#e8f4ee] rounded-full flex items-center justify-center mx-auto group-hover:bg-[#7b9e87] transition-colors">
										<Camera className="w-8 h-8 text-[#7b9e87] group-hover:text-white transition-colors" />
									</div>
									<p className="text-sm text-muted-foreground">
										Tap to capture back view
									</p>
								</div>
							</Card>
						)}
					</div>
				</div>

				{/* Tips */}
				<div className="mt-8 bg-[#e8f4ee]/50 border border-[#7b9e87]/20 rounded-2xl p-4">
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 bg-[#7b9e87]/20 rounded-lg flex items-center justify-center shrink-0">
							<Lightbulb className="w-5 h-5 text-[#7b9e87]" />
						</div>
						<div>
							<p className="text-sm font-semibold text-[#1a365d] mb-2">
								Photo Tips
							</p>
							<ul className="text-sm text-[#1a365d]/70 space-y-1">
								<li>• Use good lighting for clear photos</li>
								<li>• Keep the item centered in frame</li>
								<li>• Make sure photos are clear and focused</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Bottom CTA */}
			<div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#e8f4ee] p-4 z-40">
				<div className="container mx-auto max-w-2xl">
					<Button
						size="lg"
						className="w-full h-14 text-base font-semibold rounded-xl bg-gradient-to-r from-[#7b9e87] to-[#6a8a75] text-white border-0 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
						onClick={handleContinue}
						disabled={!frontImage || !backImage}
					>
						{frontImage && backImage ? (
							<span className="flex items-center gap-2">
								<CheckCircle className="w-5 h-5" />
								Continue to Insert Item
							</span>
						) : (
							<span>Capture Both Photos to Continue</span>
						)}
					</Button>
				</div>
			</div>
		</div>
	);
}
