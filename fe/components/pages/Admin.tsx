"use client";

import { useState, useMemo } from "react";
import { mockItems } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	CheckCircle,
	XCircle,
	Send,
	Shield,
	Package,
	Clock,
	AlertCircle,
	Filter,
	MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { getStatusColor, getStatusLabel, ItemStatus } from "@/types/donation";
import { toast } from "sonner";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { RedistributionMap } from "./RedistributionMap";

type FilterType = "all" | ItemStatus;
type TabType = "moderate" | "redistribute";

export function Admin() {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabType>("moderate");
	const [items, setItems] = useState(mockItems);
	const [filter, setFilter] = useState<FilterType>("all");
	const [selectedItems, setSelectedItems] = useState<string[]>([]);

	const filteredItems = useMemo(() => {
		let result = items;
		if (activeTab === "redistribute") {
			result = items.filter(
				(i) => i.status === "expired" || i.status === "redirected",
			);
		}
		if (filter !== "all") {
			result = result.filter((item) => item.status === filter);
		}
		return result;
	}, [items, filter, activeTab]);

	const stats = useMemo(() => {
		return {
			total: items.length,
			waiting: items.filter((i) => i.status === "waiting").length,
			available: items.filter((i) => i.status === "available").length,
			claimed: items.filter((i) => i.status === "claimed").length,
			expired: items.filter((i) => i.status === "expired").length,
		};
	}, [items]);

	const handleOverride = (itemId: string, action: "approve" | "reject") => {
		setItems((prev) =>
			prev.map((i) =>
				i.id === itemId
					? { ...i, status: action === "approve" ? "available" : "rejected" }
					: i,
			),
		);
		toast.success(
			`Item ${action === "approve" ? "approved" : "rejected"} successfully`,
		);
	};

	const handleAssignBatch = (institutionName: string) => {
		setItems((prev) =>
			prev.map((i) =>
				selectedItems.includes(i.id)
					? { ...i, status: "redirected", assignedTo: institutionName }
					: i,
			),
		);
		toast.success(
			`${selectedItems.length} items assigned to ${institutionName}`,
		);
		setSelectedItems([]);
	};

	const toggleSelection = (id: string) => {
		setSelectedItems((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleAssign = (itemId: string) => {
		toast.success("Item assigned to donation partner");
	};

	const statCards = [
		{
			label: "Total",
			value: stats.total,
			icon: Package,
			color: "text-[#1a365d]",
		},
		{
			label: "Waiting",
			value: stats.waiting,
			icon: Clock,
			color: "text-[#1a365d]",
		},
		{
			label: "Available",
			value: stats.available,
			icon: CheckCircle,
			color: "text-[#7b9e87]",
		},
		{
			label: "Expired",
			value: stats.expired,
			icon: AlertCircle,
			color: "text-orange-600",
		},
	];

	const filters: { value: FilterType; label: string; count: number }[] = [
		{ value: "all", label: "All", count: stats.total },
		{ value: "waiting", label: "Waiting", count: stats.waiting },
		{ value: "available", label: "Available", count: stats.available },
		{ value: "claimed", label: "Claimed", count: stats.claimed },
		{ value: "expired", label: "Expired", count: stats.expired },
	];

	return (
		<div className="pb-20">
			<div className="container mx-auto px-4 py-6">
				{/* Page Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<Shield className="w-5 h-5 text-[#7b9e87]" />
							<h1 className="text-xl md:text-2xl font-bold text-[#1a365d]">
								Admin Command Center
							</h1>
						</div>
						<p className="text-sm text-muted-foreground">
							{activeTab === "moderate"
								? "Review and approve new donation submissions"
								: "Redistribute stale inventory to nearby institutions"}
						</p>
					</div>

					{/* Tabs */}
					<div className="flex bg-[#e8f4ee] p-1 rounded-xl h-12 w-fit">
						<button
							onClick={() => setActiveTab("moderate")}
							className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
								activeTab === "moderate"
									? "bg-white text-[#1a365d] shadow-sm"
									: "text-[#7b9e87] hover:text-[#1a365d]"
							}`}
						>
							Moderation
						</button>
						<button
							onClick={() => setActiveTab("redistribute")}
							className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
								activeTab === "redistribute"
									? "bg-white text-[#1a365d] shadow-sm"
									: "text-[#7b9e87] hover:text-[#1a365d]"
							}`}
						>
							Redistribution
						</button>
					</div>
				</div>

				{/* Stats - Only show in moderation */}
				{activeTab === "moderate" && (
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
						{statCards.map((stat) => (
							<div
								key={stat.label}
								className="bg-white border border-[#e8f4ee] rounded-2xl p-4 shadow-sm"
							>
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-[#e8f4ee] rounded-xl flex items-center justify-center">
										<stat.icon className="w-5 h-5 text-[#7b9e87]" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
											{stat.label}
										</p>
										<p className={`text-2xl font-bold ${stat.color}`}>
											{stat.value}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{activeTab === "moderate" ? (
					<>
						{/* Filters */}
						<div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
							<Filter className="w-4 h-4 text-[#7b9e87] shrink-0" />
							{filters
								.filter((f) => !["expired", "redirected"].includes(f.value))
								.map((f) => (
									<button
										key={f.value}
										onClick={() => setFilter(f.value)}
										className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
											filter === f.value
												? "bg-[#7b9e87] text-white shadow-md"
												: "bg-[#e8f4ee] text-[#1a365d] hover:bg-[#7b9e87]/20"
										}`}
									>
										{f.label}
										<span
											className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
												filter === f.value ? "bg-white/30" : "bg-white/50"
											}`}
										>
											{f.count}
										</span>
									</button>
								))}
						</div>

						{/* Results Count */}
						<div className="mb-4 text-sm font-medium text-[#1a365d]/60">
							Showing {filteredItems.length} item
							{filteredItems.length !== 1 ? "s" : ""}
						</div>
					</>
				) : (
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
						{/* Left: Expired Items List */}
						<div className="lg:col-span-5 space-y-4">
							<div className="flex items-center justify-between mb-2">
								<h3 className="font-bold text-[#1a365d] flex items-center gap-2">
									<AlertCircle className="w-5 h-5 text-orange-500" />
									Expired Inventory
								</h3>
							</div>

							<div className="space-y-3 max-h-100 overflow-y-auto pr-2 scrollbar-thin">
								{filteredItems.map((item) => (
									<div
										key={item.id}
										onClick={() =>
											item.status === "expired" && toggleSelection(item.id)
										}
										className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex gap-3 ${
											selectedItems.includes(item.id)
												? "border-[#7b9e87] bg-[#e8f4ee]/30"
												: item.status === "redirected"
													? "border-transparent bg-slate-50 opacity-60"
													: "border-[#e8f4ee] bg-white hover:border-[#7b9e87]/30"
										}`}
									>
										<div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
											<ImageWithFallback
												src={item.image}
												alt={item.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="font-bold text-[#1a365d] text-sm">
												{item.name}
											</h4>
											<p className="text-xs text-muted-foreground mb-1 capitalize">
												{item.category} • {item.size}
											</p>
											{item.status === "redirected" ? (
												<div className="flex items-center gap-1 text-[10px] font-bold text-[#7b9e87]">
													<Send className="w-3 h-3" /> Assigned to{" "}
													{item.assignedTo}
												</div>
											) : (
												<div className="text-[14px] text-orange-600 font-medium">
													Expired{" "}
													{Math.floor(
														(new Date().getTime() -
															new Date(item.detectedAt).getTime()) /
															(1000 * 3600 * 24),
													)}{" "}
													days ago
												</div>
											)}
										</div>
										{item.status === "expired" && (
											<div
												className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${selectedItems.includes(item.id) ? "bg-[#7b9e87] border-[#7b9e87]" : "border-[#e8f4ee]"}`}
											>
												{selectedItems.includes(item.id) && (
													<CheckCircle className="w-3 h-3 text-white" />
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Right: Map Integration */}
						<div className="lg:col-span-7">
							<div className="bg-white border border-[#e8f4ee] rounded-3xl p-6 shadow-sm sticky top-6">
								<h3 className="font-bold text-[#1a365d] mb-4 flex items-center gap-2">
									<MapPin className="w-5 h-5 text-[#7b9e87]" />
									Nearby Redistribution Centers
								</h3>
								<RedistributionMap
									selectedCount={selectedItems.length}
									onAssign={handleAssignBatch}
								/>
							</div>
						</div>
					</div>
				)}

				{/* Original Moderation Views (Mobile/Desktop) - Wrap in conditional */}
				{activeTab === "moderate" && (
					<>
						{/* Mobile Cards View */}
						<div className="md:hidden space-y-4">
							{filteredItems.map((item) => (
								<div
									key={item.id}
									className="bg-white border border-[#e8f4ee] rounded-2xl p-4 space-y-3 shadow-sm"
								>
									<div className="flex gap-3">
										<div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f0f4f1] shrink-0">
											<ImageWithFallback
												src={item.image}
												alt={item.name}
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<h3 className="font-semibold text-[#1a365d] line-clamp-1">
												{item.name}
											</h3>
											<p className="text-sm text-muted-foreground capitalize">
												{item.category}
											</p>
											<Badge className={`mt-2 ${getStatusColor(item.status)}`}>
												{getStatusLabel(item.status)}
											</Badge>
										</div>
									</div>

									<div className="flex gap-2 pt-1">
										<Button
											size="sm"
											variant="outline"
											className="flex-1 h-10 text-xs font-medium border-[#7b9e87]/30 text-[#7b9e87] hover:bg-[#e8f4ee] hover:text-[#6a8a75]"
											onClick={() => handleOverride(item.id, "approve")}
										>
											<CheckCircle className="w-3.5 h-3.5 mr-1" />
											Approve
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="flex-1 h-10 text-xs font-medium border-red-200 text-red-600 hover:bg-red-50"
											onClick={() => handleOverride(item.id, "reject")}
										>
											<XCircle className="w-3.5 h-3.5 mr-1" />
											Reject
										</Button>
										<Button
											size="sm"
											variant="outline"
											className="flex-1 h-10 text-xs font-medium border-[#e8f4ee] text-[#1a365d] hover:bg-[#e8f4ee]"
											onClick={() => handleAssign(item.id)}
										>
											<Send className="w-3.5 h-3.5 mr-1" />
											Assign
										</Button>
									</div>
								</div>
							))}
						</div>

						{/* Desktop Table View */}
						<div className="hidden md:block bg-white border border-[#e8f4ee] rounded-2xl overflow-hidden shadow-sm">
							<Table>
								<TableHeader>
									<TableRow className="bg-[#f8faf9] hover:bg-[#f8faf9]">
										<TableHead className="text-[#1a365d] font-semibold">
											Item
										</TableHead>
										<TableHead className="text-[#1a365d] font-semibold">
											Category
										</TableHead>
										<TableHead className="text-[#1a365d] font-semibold">
											Status
										</TableHead>
										<TableHead className="text-[#1a365d] font-semibold">
											Detected
										</TableHead>
										<TableHead className="text-[#1a365d] font-semibold">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filteredItems.map((item) => (
										<TableRow key={item.id} className="hover:bg-[#f8faf9]/50">
											<TableCell>
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f0f4f1]">
														<ImageWithFallback
															src={item.image}
															alt={item.name}
															className="w-full h-full object-cover"
														/>
													</div>
													<span className="font-medium text-[#1a365d]">
														{item.name}
													</span>
												</div>
											</TableCell>
											<TableCell className="capitalize">
												{item.category}
											</TableCell>
											<TableCell>
												<Badge className={getStatusColor(item.status)}>
													{getStatusLabel(item.status)}
												</Badge>
											</TableCell>
											<TableCell className="text-muted-foreground">
												{new Date(item.detectedAt).toLocaleDateString()}
											</TableCell>
											<TableCell>
												<div className="flex gap-1">
													<Button
														size="sm"
														variant="ghost"
														className="h-8 w-8 p-0 text-[#7b9e87] hover:bg-[#e8f4ee] hover:text-[#6a8a75]"
														onClick={() => handleOverride(item.id, "approve")}
														title="Approve"
													>
														<CheckCircle className="w-4 h-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
														onClick={() => handleOverride(item.id, "reject")}
														title="Reject"
													>
														<XCircle className="w-4 h-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														className="h-8 px-2 text-xs text-[#1a365d] hover:bg-[#e8f4ee]"
														onClick={() => handleAssign(item.id)}
													>
														<Send className="w-3.5 h-3.5 mr-1" />
														Assign
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
