"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ShieldCheck, Heart } from "lucide-react";
import { toast } from "sonner";
import { SignInButton, useUser, useAuth } from "@clerk/nextjs";

export function DonateForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { user, isLoaded } = useUser();
	const { isSignedIn } = useAuth();
	const size = searchParams.get("size") || "small";

	const [loading, setLoading] = useState(false);

	const handleComplete = () => {
		setLoading(true);

		// Simulate finalization
		setTimeout(() => {
			setLoading(false);
			toast.success("Donation logic linked to account!");
			router.push("/donate/reward");
		}, 1500);
	};

	if (!isLoaded)
		return (
			<div className="min-h-screen flex items-center justify-center">
				Loading...
			</div>
		);

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				<div className="text-center mb-10">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-[#e8f4ee] rounded-2xl mb-4">
						<Heart className="w-8 h-8 text-[#7b9e87]" />
					</div>
					<h1 className="text-2xl font-bold text-[#1a365d] mb-2">
						Finalize Your Donation
					</h1>
					<p className="text-muted-foreground">
						{isSignedIn
							? "Confirm your details to receive rewards and track your impact"
							: "Sign in to receive rewards and track your donation impact"}
					</p>
				</div>

				<div className="space-y-6">
					{isSignedIn ? (
						<div className="bg-white border border-[#e8f4ee] rounded-3xl p-6 shadow-sm">
							<div className="flex items-center gap-4 mb-6">
								<div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100">
									<img
										src={user?.imageUrl}
										alt="Profile"
										className="w-full h-full object-cover"
									/>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Signed in as</p>
									<p className="font-bold text-[#1a365d]">
										{user?.fullName || user?.username}
									</p>
									<p className="text-xs text-muted-foreground">
										{user?.primaryEmailAddress?.emailAddress}
									</p>
								</div>
							</div>

							<div className="space-y-4">
								<div className="bg-[#e8f4ee]/50 rounded-2xl p-4 flex items-start gap-3">
									<ShieldCheck className="w-5 h-5 text-[#7b9e87] shrink-0 mt-0.5" />
									<div>
										<p className="text-sm font-semibold text-[#1a365d]">
											Verified Donor Account
										</p>
										<p className="text-xs text-muted-foreground mt-0.5">
											Your points and impact history will be automatically saved
											to this profile.
										</p>
									</div>
								</div>

								<Button
									onClick={handleComplete}
									className="w-full h-12 bg-[#7b9e87] hover:bg-[#6a8a75] text-white rounded-xl font-bold transition-all"
									disabled={loading}
								>
									{loading ? "Processing..." : "Complete Donation"}
								</Button>
							</div>
						</div>
					) : (
						<div className="bg-white border border-[#e8f4ee] rounded-3xl p-8 shadow-sm text-center">
							<SignInButton mode="modal">
								<Button className="w-full h-14 bg-[#1a365d] hover:bg-[#152c4d] text-white rounded-xl font-bold text-lg shadow-lg shadow-[#1a365d]/10 mb-4 transition-all scale-100 active:scale-95">
									Sign In to Complete
								</Button>
							</SignInButton>
							<p className="text-xs text-muted-foreground">
								Don't have an account? No worries, we'll create one for you
								during sign in.
							</p>
						</div>
					)}

					{/* Benefits */}
					<div className="bg-accent border border-primary/20 rounded-2xl p-6 space-y-3">
						<p className="text-sm text-foreground font-bold">
							What you'll get:
						</p>
						<ul className="text-sm text-muted-foreground space-y-2">
							<li className="flex items-center gap-2">
								•{" "}
								<span className="font-medium text-[#1a365d]">
									Reward points
								</span>{" "}
								for your donation
							</li>
							<li className="flex items-center gap-2">
								•{" "}
								<span className="font-medium text-[#1a365d]">
									Email confirmation
								</span>{" "}
								and digital receipt
							</li>
							<li className="flex items-center gap-2">
								•{" "}
								<span className="font-medium text-[#1a365d]">
									Real-time tracking
								</span>{" "}
								of your impact
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
}
