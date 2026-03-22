import { Suspense } from "react";
import { DonateForm } from "@/components/pages/DonateForm";

export default function DonateFormPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DonateForm />
		</Suspense>
	);
}
