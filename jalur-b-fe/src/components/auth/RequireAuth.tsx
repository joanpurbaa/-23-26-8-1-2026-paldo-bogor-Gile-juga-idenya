import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface RequireAuthProps {
	children: ReactNode;
}

function FullPageLoader() {
	return (
		<div className="min-h-screen bg-[#F9F9FB] text-neutral flex flex-col items-center justify-center p-4 font-sans">
			<p className="text-sm font-medium text-neutral/70">Memuat...</p>
		</div>
	);
}

export default function RequireAuth({ children }: RequireAuthProps) {
	const { status } = useAuth();
	const location = useLocation();

	if (status === "loading") {
		return <FullPageLoader />;
	}

	if (status === "unauthenticated") {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	return <>{children}</>;
}
