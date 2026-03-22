export type ItemStatus =
	| "waiting"
	| "available"
	| "claimed"
	| "delivered"
	| "rejected"
	| "expired"
	| "redirected"
	| "completed";
export type ItemSize = "small" | "big";
export type DeliveryMethod = "delivery" | "pickup";
export type PickupPoint = "canteen" | "lobby" | "library" | "parking";

export interface DonationItem {
	id: string;
	name: string;
	image: string;
	frontImage?: string;
	backImage?: string;
	detectedAt: Date;
	status: ItemStatus;
	condition: string;
	category: string;
	size: ItemSize;
	donorName?: string;
	donorEmail?: string;
	assignedTo?: string; // New field for redistribution
	claimedBy?: {
		name: string;
		email: string;
		method: DeliveryMethod;
		pickupPoint?: PickupPoint;
		claimedAt: Date;
		pickedUpAt?: Date;
	};
}

export interface DonationFormData {
	size: ItemSize;
	frontImage?: File;
	backImage?: File;
	donorName: string;
	donorEmail: string;
}

export interface ClaimFormData {
	name: string;
	email: string;
	phone: string;
	method: DeliveryMethod;
	pickupPoint?: PickupPoint;
	address?: string;
}

export function getStatusColor(status: ItemStatus): string {
	switch (status) {
		case "waiting":
			return "bg-gray-100 text-gray-700";
		case "available":
			return "bg-green-100 text-green-700";
		case "claimed":
			return "bg-blue-100 text-blue-700";
		case "delivered":
			return "bg-purple-100 text-purple-700";
		case "expired":
			return "bg-amber-100 text-amber-700";
		case "rejected":
			return "bg-red-100 text-red-700";
		case "redirected":
			return "bg-emerald-100 text-emerald-700";
		default:
			return "bg-gray-100 text-gray-700";
	}
}

export function getStatusLabel(status: ItemStatus): string {
	switch (status) {
		case "waiting":
			return "Processing";
		case "available":
			return "Available";
		case "claimed":
			return "Claimed";
		case "delivered":
			return "Delivered";
		case "expired":
			return "Expired";
		case "rejected":
			return "Rejected";
		case "redirected":
			return "Redirected";
		default:
			return status;
	}
}

export function getPickupPointLabel(point: PickupPoint): string {
	switch (point) {
		case "canteen":
			return "Canteen";
		case "lobby":
			return "Main Lobby";
		case "library":
			return "Library";
		case "parking":
			return "Parking Area";
		default:
			return point;
	}
}
