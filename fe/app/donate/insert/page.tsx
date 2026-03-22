import { Suspense } from "react";
import { DonateInsert } from "@/components/pages/DonateInsert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DonateInsertPage() {
	return (
		<Suspense fallback={<LoadingSpinner message="Preparing Scanner..." />}>
			<DonateInsert />
		</Suspense>
	);
}
