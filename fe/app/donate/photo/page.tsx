import { Suspense } from "react";
import { DonatePhoto } from "@/components/pages/DonatePhoto";

export default function DonatePhotoPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DonatePhoto />
		</Suspense>
	);
}
