import { DonationItem } from "../types/donation";

// Helper to create dates relative to now
const hoursAgo = (hours: number) => {
	const date = new Date();
	date.setHours(date.getHours() - hours);
	return date;
};

export const mockItems: DonationItem[] = [
	{
		id: "1",
		name: "Wireless Earphones",
		image:
			"https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(12),
		status: "available",
		condition: "Eligible for reuse",
		category: "Electronics",
		size: "small",
		donorName: "Sarah M.",
		donorEmail: "sarah@example.com",
	},
	{
		id: "99",
		name: "Power Bank",
		image:
			"https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(200),
		status: "expired",
		condition: "Worn out but functional",
		category: "Electronics",
		size: "small",
		donorName: "Old Item",
		donorEmail: "old@example.com",
	},
	{
		id: "4",
		name: "Notebook",
		image:
			"https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(72),
		status: "available",
		condition: "Slightly used",
		category: "Stationery",
		size: "small",
		donorName: "Alex K.",
		donorEmail: "alex@example.com",
	},
	{
		id: "5",
		name: "USB Cable",
		image:
			"https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(36),
		status: "available",
		condition: "Functional",
		category: "Electronics",
		size: "small",
		donorName: "Lisa P.",
		donorEmail: "lisa@example.com",
	},
	{
		id: "6",
		name: "Water Bottle",
		image:
			"https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(85),
		status: "available",
		condition: "Clean",
		category: "Household",
		size: "small",
		donorName: "David R.",
		donorEmail: "david@example.com",
	},
	{
		id: "7",
		name: "Backpack",
		image:
			"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
		frontImage:
			"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop",
		backImage:
			"https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(115),
		status: "available",
		condition: "Good condition",
		category: "Accessories",
		size: "big",
		donorName: "Rachel T.",
		donorEmail: "rachel@example.com",
	},
	{
		id: "9",
		name: "Mechanical Keyboard",
		image:
			"https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(5),
		status: "available",
		condition: "Dusty but working",
		category: "Electronics",
		size: "small",
		donorName: "Kevin L.",
		donorEmail: "kevin@example.com",
	},
	{
		id: "10",
		name: "Calculus Textbook",
		image:
			"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(48),
		status: "available",
		condition: "Highlighted pages",
		category: "Books",
		size: "big",
		donorName: "Sophia G.",
		donorEmail: "sophia@example.com",
	},
	{
		id: "11",
		name: "Desk Lamp",
		image:
			"https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&h=800&fit=crop",
		frontImage:
			"https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=800&h=800&fit=crop",
		backImage:
			"https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(120),
		status: "claimed",
		condition: "Excellent condition",
		category: "Household",
		size: "big",
		donorName: "Marcus V.",
		donorEmail: "marcus@example.com",
		claimedBy: {
			name: "Elena Rodriguez",
			email: "elena@example.com",
			method: "pickup",
			pickupPoint: "lobby",
			claimedAt: hoursAgo(24),
		},
	},
	{
		id: "13",
		name: "Winter Jacket",
		image:
			"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop",
		frontImage:
			"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=800&fit=crop",
		backImage:
			"https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(200),
		status: "available",
		condition: "Slightly worn",
		category: "Clothing",
		size: "big",
		donorName: "Jessica C.",
		donorEmail: "jess@example.com",
	},
	{
		id: "14",
		name: "Watercolor Set",
		image:
			"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(15),
		status: "available",
		condition: "Half used",
		category: "Stationery",
		size: "small",
		donorName: "Maya F.",
		donorEmail: "maya@example.com",
	},
	{
		id: "16",
		name: "Coffee Mug",
		image:
			"https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=800&h=800&fit=crop",
		detectedAt: hoursAgo(3),
		status: "claimed",
		condition: "Clean, no chips",
		category: "Household",
		size: "small",
		donorName: "Rachel T.",
		donorEmail: "rachel@example.com",
		claimedBy: {
			name: "James Wilson",
			email: "james@example.com",
			method: "pickup",
			pickupPoint: "library",
			claimedAt: hoursAgo(1),
		},
	},
];

export const pickupPoints = [
	{
		id: "canteen",
		name: "Canteen",
		address: "Building A, Floor 1",
		hours: "8:00 AM - 8:00 PM",
	},
	{
		id: "lobby",
		name: "Main Lobby",
		address: "Main Building, Ground Floor",
		hours: "24/7",
	},
	{
		id: "library",
		name: "Library",
		address: "Building B, Floor 2",
		hours: "9:00 AM - 9:00 PM",
	},
	{
		id: "parking",
		name: "Parking Area",
		address: "Basement Level 1",
		hours: "24/7",
	},
];
