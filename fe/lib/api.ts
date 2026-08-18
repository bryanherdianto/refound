import { DonationItem, ClaimFormData, ItemStatus } from "@/types/donation";
import { Institution } from "@/types/institution";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(
	path: string,
	options?: RequestInit,
	token?: string | null
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			...(options?.headers || {}),
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({ detail: res.statusText }));
		throw new Error(error.detail || `API error ${res.status}`);
	}

	return res.json();
}

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------

/**
 * The API returns dates as ISO strings. Revive them so components can call
 * Date methods without each one remembering to convert.
 */
function reviveItem(raw: DonationItem): DonationItem {
	return {
		...raw,
		detectedAt: new Date(raw.detectedAt),
		claimedBy: raw.claimedBy
			? {
					...raw.claimedBy,
					claimedAt: new Date(raw.claimedBy.claimedAt),
					pickedUpAt: raw.claimedBy.pickedUpAt
						? new Date(raw.claimedBy.pickedUpAt)
						: undefined,
				}
			: undefined,
	};
}

export async function fetchItems(
	status?: ItemStatus
): Promise<DonationItem[]> {
	const query = status ? `?status=${status}` : "";
	const items = await apiFetch<DonationItem[]>(`/api/items${query}`);
	return items.map(reviveItem);
}

export async function fetchItem(id: string): Promise<DonationItem> {
	return reviveItem(await apiFetch<DonationItem>(`/api/items/${id}`));
}

// ---------------------------------------------------------------------------
// Donate
// ---------------------------------------------------------------------------

export interface DonateSmallPayload {
	donorName: string;
	donorEmail: string;
	agreedToRedistribution: boolean;
}

export async function donateSmallItem(
	data: DonateSmallPayload
): Promise<DonationItem> {
	const form = new FormData();
	form.append("size", "small");
	form.append("donor_name", data.donorName);
	form.append("donor_email", data.donorEmail);
	form.append(
		"agreed_to_redistribution",
		String(data.agreedToRedistribution)
	);
	return apiFetch<DonationItem>("/api/donate", {
		method: "POST",
		body: form,
	});
}

export interface DonateBigPayload {
	donorName: string;
	donorEmail: string;
	agreedToRedistribution: boolean;
	photoFront: File;
	photoBack: File;
}

export async function donateBigItem(
	data: DonateBigPayload
): Promise<DonationItem> {
	const form = new FormData();
	form.append("size", "big");
	form.append("donor_name", data.donorName);
	form.append("donor_email", data.donorEmail);
	form.append(
		"agreed_to_redistribution",
		String(data.agreedToRedistribution)
	);
	form.append("photo_front", data.photoFront);
	form.append("photo_back", data.photoBack);

	return apiFetch<DonationItem>("/api/donate", {
		method: "POST",
		body: form,
	});
}

// ---------------------------------------------------------------------------
// Claim
// ---------------------------------------------------------------------------

export async function claimItem(
	itemId: string,
	data: ClaimFormData
): Promise<DonationItem> {
	return apiFetch<DonationItem>(`/api/claim/${itemId}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			name: data.name,
			email: data.email,
			phone: data.phone,
			method: data.method,
			pickup_point: data.pickupPoint || null,
			address: data.address || null,
		}),
	});
}

// ---------------------------------------------------------------------------
// Tracking
// ---------------------------------------------------------------------------

export async function fetchTracking(
	email: string
): Promise<DonationItem[]> {
	const items = await apiFetch<DonationItem[]>(
		`/api/tracking?email=${encodeURIComponent(email)}`
	);
	return items.map(reviveItem);
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function adminListItems(
	token: string | null
): Promise<DonationItem[]> {
	const items = await apiFetch<DonationItem[]>(
		"/api/admin/items",
		undefined,
		token
	);
	return items.map(reviveItem);
}

export async function adminUpdateStatus(
	token: string | null,
	itemId: string,
	status: ItemStatus,
	institutionName?: string
): Promise<DonationItem> {
	return apiFetch<DonationItem>(
		`/api/admin/items/${itemId}/status`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				status,
				institution_name: institutionName || null,
			}),
		},
		token
	);
}

export async function adminAssignItem(
	token: string | null,
	itemId: string,
	institutionName: string
): Promise<DonationItem> {
	// institution_name is a query param on the backend, not a body field.
	return apiFetch<DonationItem>(
		`/api/admin/items/${itemId}/assign?institution_name=${encodeURIComponent(institutionName)}`,
		{ method: "POST" },
		token
	);
}

export async function adminCompleteItem(
	token: string | null,
	itemId: string
): Promise<DonationItem> {
	return apiFetch<DonationItem>(
		`/api/admin/items/${itemId}/complete`,
		{ method: "PATCH" },
		token
	);
}

export async function adminMarkPickedUp(
	token: string | null,
	itemId: string
): Promise<DonationItem> {
	return apiFetch<DonationItem>(
		`/api/admin/items/${itemId}/pickup`,
		{ method: "PATCH" },
		token
	);
}

// ---------------------------------------------------------------------------
// Institutions
// ---------------------------------------------------------------------------

export async function fetchInstitutions(): Promise<Institution[]> {
	return apiFetch<Institution[]>("/api/institutions");
}

// ---------------------------------------------------------------------------
// ESP32
// ---------------------------------------------------------------------------

export interface CaptureResult {
	success: boolean;
	accepted?: boolean;
	item_id?: string;
	name?: string;
	category?: string;
	condition?: string;
	image?: string;
	reason?: string;
	error?: string;
}

export async function esp32Status(): Promise<{ connected: boolean }> {
	return apiFetch<{ connected: boolean }>("/api/esp32/status");
}

export async function esp32Capture(): Promise<CaptureResult> {
	// Longer timeout since this waits for hardware + AI analysis
	const res = await fetch(`${API_URL}/api/esp32/capture`, {
		method: "POST",
		signal: AbortSignal.timeout(35000),
	});
	return res.json();
}

// ---------------------------------------------------------------------------
// Donate — Donor Info Update (for ESP32-created items)
// ---------------------------------------------------------------------------

export async function updateDonorInfo(
	itemId: string,
	data: {
		donorName: string;
		donorEmail: string;
		agreedToRedistribution: boolean;
	}
): Promise<DonationItem> {
	const form = new FormData();
	form.append("donor_name", data.donorName);
	form.append("donor_email", data.donorEmail);
	form.append(
		"agreed_to_redistribution",
		String(data.agreedToRedistribution)
	);

	return apiFetch<DonationItem>(`/api/donate/${itemId}/donor`, {
		method: "PATCH",
		body: form,
	});
}
