"use client";

import {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from "react";
import { ItemSize, DonationItem } from "@/types/donation";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DonationState {
	size: ItemSize;
	frontPhoto: File | null;
	backPhoto: File | null;
	description: string;
	category: string;
	agreedToRedistribution: boolean;
	/** The item returned from the API after a successful donation */
	createdItem: DonationItem | null;
	/** The MongoDB ID of the item created by the ESP32 capture flow */
	espItemId: string | null;
}

interface DonationContextValue extends DonationState {
	setSize: (size: ItemSize) => void;
	setFrontPhoto: (file: File | null) => void;
	setBackPhoto: (file: File | null) => void;
	setDescription: (desc: string) => void;
	setCategory: (cat: string) => void;
	setAgreedToRedistribution: (agreed: boolean) => void;
	setCreatedItem: (item: DonationItem | null) => void;
	setEspItemId: (id: string | null) => void;
	reset: () => void;
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const defaultState: DonationState = {
	size: "small",
	frontPhoto: null,
	backPhoto: null,
	description: "",
	category: "",
	agreedToRedistribution: false,
	createdItem: null,
	espItemId: null,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<DonationState>(defaultState);

	const setSize = useCallback(
		(size: ItemSize) => setState((s) => ({ ...s, size })),
		[]
	);
	const setFrontPhoto = useCallback(
		(file: File | null) => setState((s) => ({ ...s, frontPhoto: file })),
		[]
	);
	const setBackPhoto = useCallback(
		(file: File | null) => setState((s) => ({ ...s, backPhoto: file })),
		[]
	);
	const setDescription = useCallback(
		(description: string) => setState((s) => ({ ...s, description })),
		[]
	);
	const setCategory = useCallback(
		(category: string) => setState((s) => ({ ...s, category })),
		[]
	);
	const setAgreedToRedistribution = useCallback(
		(agreedToRedistribution: boolean) =>
			setState((s) => ({ ...s, agreedToRedistribution })),
		[]
	);
	const setCreatedItem = useCallback(
		(createdItem: DonationItem | null) =>
			setState((s) => ({ ...s, createdItem })),
		[]
	);
	const setEspItemId = useCallback(
		(espItemId: string | null) =>
			setState((s) => ({ ...s, espItemId })),
		[]
	);
	const reset = useCallback(() => setState(defaultState), []);

	return (
		<DonationContext.Provider
			value={{
				...state,
				setSize,
				setFrontPhoto,
				setBackPhoto,
				setDescription,
				setCategory,
				setAgreedToRedistribution,
				setCreatedItem,
				setEspItemId,
				reset,
			}}
		>
			{children}
		</DonationContext.Provider>
	);
}

export function useDonation(): DonationContextValue {
	const ctx = useContext(DonationContext);
	if (!ctx) {
		throw new Error("useDonation must be used within <DonationProvider>");
	}
	return ctx;
}
