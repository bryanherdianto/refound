"use client";

import { useState, useEffect, useMemo } from "react";
import { ItemCard } from "@/components/ItemCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockItems } from "@/data/mockData";
import { DonationItem } from "@/types/donation";
import {
	ArrowLeft,
	Search,
	PackageOpen,
	ArrowDownWideNarrow,
	ArrowUpWideNarrow,
} from "lucide-react";
import { useRouter } from "next/navigation";

type FilterType = "all" | "available" | "claimed";
type SortType = "newest" | "oldest";

export function Items() {
	const router = useRouter();
	const [filter, setFilter] = useState<FilterType>("all");
	const [sort, setSort] = useState<SortType>("newest");
	const [searchQuery, setSearchQuery] = useState("");
	const [items, setItems] = useState<DonationItem[]>(mockItems);

	// Simulate real-time updates
	useEffect(() => {
		const interval = setInterval(() => {
			setItems([...mockItems]);
		}, 60000);

		return () => clearInterval(interval);
	}, []);

	// Count items for each filter
	const counts = useMemo(() => {
		return {
			all: items.filter(
				(item) =>
					item.status === "available" ||
					item.status === "waiting" ||
					item.status === "claimed",
			).length,
			available: items.filter((item) => item.status === "available").length,
			claimed: items.filter((item) => item.status === "claimed").length,
		};
	}, [items]);

	// Filter and sort items
	const filteredItems = useMemo(() => {
		let result = items.filter((item) => {
			if (filter === "all")
				return (
					item.status === "available" ||
					item.status === "waiting" ||
					item.status === "claimed"
				);
			if (filter === "available") return item.status === "available";
			if (filter === "claimed") return item.status === "claimed";
			return true;
		});

		// Search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(item) =>
					item.name.toLowerCase().includes(query) ||
					item.category.toLowerCase().includes(query),
			);
		}

		// Sort
		result = [...result].sort((a, b) => {
			const dateA = new Date(a.detectedAt).getTime();
			const dateB = new Date(b.detectedAt).getTime();
			return sort === "newest" ? dateB - dateA : dateA - dateB;
		});

		return result;
	}, [items, filter, searchQuery, sort]);

	// Get page title based on filter
	const pageTitle =
		filter === "all"
			? "All Items"
			: filter === "available"
				? "Available Items"
				: "Claimed Items";

	return (
		<div>
			<div className="container mx-auto px-4 py-6">
				{/* Search */}
				<div className="relative mb-4">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder="Search items..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-10 h-10 bg-[#e8f4ee]/30 border-[#e8f4ee] focus:border-[#7b9e87] focus:ring-[#7b9e87]"
					/>
				</div>

				{/* Compact Filter Bar */}
				<div className="flex items-center justify-between gap-3 mb-4 overflow-x-auto pb-2">
					<div className="flex items-center gap-2">
						{/* Status Pills */}
						<button
							onClick={() => setFilter("all")}
							className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
								filter === "all"
									? "bg-[#7b9e87] text-white"
									: "bg-[#e8f4ee] text-[#1a365d] hover:bg-[#7b9e87]/20"
							}`}
						>
							All
							<span className="ml-1.5 px-1.5 py-0.5 bg-white/30 rounded-full text-[10px]">
								{counts.all}
							</span>
						</button>
						<button
							onClick={() => setFilter("available")}
							className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
								filter === "available"
									? "bg-[#7b9e87] text-white"
									: "bg-[#e8f4ee] text-[#1a365d] hover:bg-[#7b9e87]/20"
							}`}
						>
							Available
							<span className="ml-1.5 px-1.5 py-0.5 bg-white/30 rounded-full text-[10px]">
								{counts.available}
							</span>
						</button>
						<button
							onClick={() => setFilter("claimed")}
							className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
								filter === "claimed"
									? "bg-[#7b9e87] text-white"
									: "bg-[#e8f4ee] text-[#1a365d] hover:bg-[#7b9e87]/20"
							}`}
						>
							Claimed
							<span className="ml-1.5 px-1.5 py-0.5 bg-white/30 rounded-full text-[10px]">
								{counts.claimed}
							</span>
						</button>
					</div>

					{/* Sort Toggle */}
					<button
						onClick={() => setSort(sort === "newest" ? "oldest" : "newest")}
						className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-[#e8f4ee] text-[#1a365d] hover:bg-[#7b9e87]/20 transition-all whitespace-nowrap shrink-0"
					>
						{sort === "newest" ? (
							<>
								<ArrowDownWideNarrow className="w-3 h-3" />
								<span>Newest</span>
							</>
						) : (
							<>
								<ArrowUpWideNarrow className="w-3 h-3" />
								<span>Oldest</span>
							</>
						)}
					</button>
				</div>

				{/* Items Grid */}
				{filteredItems.length > 0 ? (
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
						{filteredItems.map((item) => (
							<ItemCard key={item.id} item={item} />
						))}
					</div>
				) : (
					<div className="text-center py-16 px-4">
						<div className="w-20 h-20 bg-[#e8f4ee] rounded-full flex items-center justify-center mx-auto mb-6">
							<PackageOpen className="w-10 h-10 text-[#7b9e87]" />
						</div>
						<h3 className="text-xl font-semibold text-[#1a365d] mb-2">
							No items found
						</h3>
						<p className="text-muted-foreground mb-6 max-w-md mx-auto">
							{searchQuery
								? `No items match "${searchQuery}". Try a different search.`
								: "No items available. Check back later!"}
						</p>
						<Button
							onClick={() => {
								setSearchQuery("");
								setFilter("all");
							}}
							className="bg-[#7b9e87] hover:bg-[#6a8a75] text-white"
						>
							Clear Filters
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
