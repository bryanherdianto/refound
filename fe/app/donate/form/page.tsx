import { Suspense } from "react";
import { DonateForm } from "@/components/pages/DonateForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DonateFormPage() {
	return (
		<Suspense fallback={<LoadingSpinner message="Loading Form..." />}>
			<DonateForm />
		</Suspense>
	);
}
