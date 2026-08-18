import { PickupPoint } from "@/types/donation";

/**
 * The pickup points the backend accepts. These ids mirror the `PickupPoint`
 * enum in be/models/item.py — keep the two in sync.
 */
export const pickupPoints: { id: PickupPoint; name: string }[] = [
	{ id: "canteen", name: "Canteen" },
	{ id: "lobby", name: "Main Lobby" },
	{ id: "library", name: "Library" },
	{ id: "parking", name: "Parking Area" },
];
