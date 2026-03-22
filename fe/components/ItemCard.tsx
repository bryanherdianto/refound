"use client";

import { DonationItem, getStatusColor, getStatusLabel } from "@/types/donation";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ImageWithFallback } from "@/components/ImageWithFallback";

interface ItemCardProps {
	item: DonationItem;
}

export function ItemCard({ item }: ItemCardProps) {
	const router = useRouter();

	return (
		<Card
			className="overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-[#7b9e87]/10 transition-all duration-300 border border-[#e8f4ee] hover:border-[#7b9e87]/30 group gap-0"
			onClick={() => router.push(`/item/${item.id}`)}
		>
			<div className="aspect-square relative overflow-hidden bg-[#f8faf9]">
				<ImageWithFallback
					src={item.image}
					alt={item.name}
					className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				/>
				<Badge
					className={`absolute top-2 right-2 ${getStatusColor(item.status)} shadow-sm`}
				>
					{getStatusLabel(item.status)}
				</Badge>
			</div>
			<div className="p-4 space-y-2">
				<h3 className="font-semibold text-[#1a365d] text-sm md:text-base leading-tight">
					{item.name}
				</h3>
				<div className="flex items-center justify-between">
					<span className="px-2 py-0.5 bg-[#e8f4ee] text-[#7b9e87] rounded-full text-xs font-medium capitalize">
						{item.category}
					</span>
				</div>
				{item.donorName && (
					<p className="text-xs text-muted-foreground pt-1">
						Donated by {item.donorName}
					</p>
				)}
			</div>
		</Card>
	);
}
