import { Suspense } from "react";
import { ClaimSuccess } from "@/components/pages/ClaimSuccess";

export default function ClaimSuccessPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<ClaimSuccess />
		</Suspense>
	);
}
