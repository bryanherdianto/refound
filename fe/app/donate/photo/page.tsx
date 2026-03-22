import { Suspense } from "react";
import { DonatePhoto } from "@/components/pages/DonatePhoto";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DonatePhotoPage() {
	return (
		<Suspense fallback={<LoadingSpinner message="Loading Camera..." />}>
			<DonatePhoto />
		</Suspense>
	);
}
