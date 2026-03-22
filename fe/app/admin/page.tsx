"use client";

import { Admin } from "@/components/pages/Admin";
import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
	const { isLoaded, user } = useUser();

	useEffect(() => {
		if (isLoaded && (!user || user.publicMetadata?.role !== "admin")) {
			redirect("/");
		}
	}, [isLoaded, user]);

	if (!isLoaded) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
			</div>
		);
	}

	if (!user || user.publicMetadata?.role !== "admin") {
		return null;
	}

	return <Admin />;
}
