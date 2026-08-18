export type InstitutionType = "orphanage" | "nursing_home";

export interface Institution {
	id: string;
	name: string;
	address: string;
	phone: string;
	lat: number;
	lng: number;
	type: InstitutionType;
}
