import { Suspense } from "react";
import { DonateInsert } from "@/components/pages/DonateInsert";

export default function DonateInsertPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<DonateInsert />
		</Suspense>
	);
}
