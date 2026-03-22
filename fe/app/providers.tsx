"use client";

import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

type ProvidersProps = {
	children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
	return (
		<>
			{children}
			<Toaster />
		</>
	);
}
