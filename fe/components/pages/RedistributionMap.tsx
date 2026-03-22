"use client";

import { GoogleMap, useJsApiLoader, InfoWindowF } from "@react-google-maps/api";
import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, Building2, CheckCircle2, Loader2 } from "lucide-react";

// Internal light-weight Advanced Marker component
function AdvancedMarker({
	map,
	position,
	onClick,
	color,
}: {
	map?: google.maps.Map | null;
	position: google.maps.LatLngLiteral;
	onClick: () => void;
	color: string;
}) {
	useEffect(() => {
		if (!map) return;

		const marker = new google.maps.marker.AdvancedMarkerElement({
			position,
			map,
		});

		const pin = new google.maps.marker.PinElement({
			background: color,
			borderColor: "#ffffff",
			glyphColor: "#ffffff",
		});

		marker.content = pin.element;
		const listener = marker.addListener("gmp-click", onClick);

		return () => {
			marker.map = null;
			google.maps.event.removeListener(listener);
		};
	}, [map, position, onClick, color]);

	return null;
}

interface Institution {
	id: string;
	name: string;
	address: string;
	phone: string;
	lat: number;
	lng: number;
	type: "orphanage" | "nursing_home";
}

interface RedistributionMapProps {
	onAssign: (institutionName: string) => void;
	selectedCount: number;
}

const mapContainerStyle = {
	width: "100%",
	height: "300px",
	borderRadius: "1rem",
};

const mapContainerStyleDesktop = {
	width: "100%",
	height: "500px",
	borderRadius: "1rem",
};

const LIBRARIES: "marker"[] = ["marker"];

// Mock data for institutions - in real app, fetch from Google Places API
const mockInstitutions: Institution[] = [
	{
		id: "inst-1",
		name: "Golden Age Nursing Home",
		address: "123 Serenity Lane, Wellness District",
		phone: "+1 234-567-8901",
		lat: 13.7563, // Example coords (Bangkok area style)
		lng: 100.5018,
		type: "nursing_home",
	},
	{
		id: "inst-2",
		name: "Sunshine Children's Home",
		address: "45 Hope Street, Care Colony",
		phone: "+1 234-567-8902",
		lat: 13.7463,
		lng: 100.5318,
		type: "orphanage",
	},
];

export function RedistributionMap({
	onAssign,
	selectedCount,
}: RedistributionMapProps) {
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
		libraries: LIBRARIES,
	});

	const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
	const [map, setMap] = useState<google.maps.Map | null>(null);

	const center = useMemo(() => ({ lat: 13.7563, lng: 100.5018 }), []);

	if (!isLoaded)
		return (
			<div className="h-64 md:h-125 w-full bg-[#e8f4ee] rounded-2xl flex items-center justify-center">
				<div className="flex items-center gap-2 text-[#7b9e87]">
					<Loader2 className="w-5 h-5 animate-spin" />
					<span>Loading Maps...</span>
				</div>
			</div>
		);

	return (
		<div className="space-y-4">
			<div className="relative group">
				<GoogleMap
					mapContainerStyle={mapContainerStyle}
					center={center}
					zoom={13}
					onLoad={(map) => setMap(map)}
					onUnmount={() => setMap(null)}
					options={{
						mapId: "DEMO_MAP_ID",
						disableDefaultUI: true,
						zoomControl: true,
						styles: [
							{
								featureType: "poi.business",
								stylers: [{ visibility: "off" }],
							},
							{
								featureType: "transit",
								elementType: "labels.icon",
								stylers: [{ visibility: "off" }],
							},
						],
					}}
				>
					{mockInstitutions.map((inst) => (
						<AdvancedMarker
							key={inst.id}
							map={map}
							position={{ lat: inst.lat, lng: inst.lng }}
							onClick={() => setSelectedInst(inst)}
							color={inst.type === "orphanage" ? "#7b9e87" : "#1a365d"}
						/>
					))}

					{selectedInst && (
						<InfoWindowF
							position={{ lat: selectedInst.lat, lng: selectedInst.lng }}
							onCloseClick={() => setSelectedInst(null)}
						>
							<div className="p-2 max-w-50">
								<h3 className="font-bold text-sm text-[#1a365d] mb-2">
									{selectedInst.name}
								</h3>
								<p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mb-1">
									<MapPin className="w-3 h-3" /> {selectedInst.address}
								</p>
								<p className="text-[10px] text-[#7b9e87] font-medium flex items-center gap-1 mb-2">
									<Phone className="w-3 h-3" />
									<a
										href={`tel:${selectedInst.phone}`}
										className="hover:underline"
									>
										{selectedInst.phone}
									</a>
								</p>
								<Button
									size="sm"
									className="w-full h-7 text-[12px] bg-linear-to-r from-[#7b9e87] to-[#6a8a75] hover:opacity-90"
									disabled={selectedCount === 0}
									onClick={() => onAssign(selectedInst.name)}
								>
									{selectedCount > 0
										? `Assign ${selectedCount} Items`
										: "Select Items First"}
								</Button>
							</div>
						</InfoWindowF>
					)}
				</GoogleMap>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{mockInstitutions.map((inst) => (
					<Card
						key={inst.id}
						className={`p-4 cursor-pointer transition-all border-2 ${selectedInst?.id === inst.id ? "border-[#7b9e87] bg-[#e8f4ee]/30" : "border-transparent hover:border-[#e8f4ee]"}`}
						onClick={() => setSelectedInst(inst)}
					>
						<div className="flex items-start gap-3">
							<div
								className={`p-2 rounded-lg ${inst.type === "orphanage" ? "bg-[#e8f4ee] text-[#7b9e87]" : "bg-[#1a365d]/5 text-[#1a365d]"}`}
							>
								<Building2 className="w-5 h-5" />
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-1">
									<h4 className="font-semibold text-[#1a365d] text-sm">
										{inst.name}
									</h4>
									{selectedInst?.id === inst.id && (
										<CheckCircle2 className="w-4 h-4 text-[#7b9e87]" />
									)}
								</div>
								<div className="flex items-center gap-2 mb-1">
									<span
										className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
											inst.type === "orphanage"
												? "bg-[#e8f4ee] text-[#7b9e87]"
												: "bg-[#1a365d]/10 text-[#1a365d]"
										}`}
									>
										{inst.type === "orphanage" ? "Orphanage" : "Nursing Home"}
									</span>
								</div>
								<p className="text-xs text-muted-foreground line-clamp-1">
									{inst.address}
								</p>
							</div>
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
