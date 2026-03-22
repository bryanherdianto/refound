export function LoadingSpinner({ message }: { message?: string }) {
	return (
		<div className="flex h-screen items-center justify-center bg-white/50 backdrop-blur-sm fixed inset-0 z-50">
			<div className="flex flex-col items-center gap-4">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-[#7b9e87] border-t-transparent shadow-lg shadow-[#7b9e87]/10"></div>
				<div className="bg-[#e8f4ee] px-4 py-2 rounded-full border border-[#7b9e87]/20 shadow-sm">
					<p className="text-sm font-medium text-[#7b9e87] flex items-center gap-2">
						<span className="w-2 h-2 bg-[#7b9e87] rounded-full animate-pulse"></span>
						{message || "Loading..."}
					</p>
				</div>
			</div>
		</div>
	);
}
