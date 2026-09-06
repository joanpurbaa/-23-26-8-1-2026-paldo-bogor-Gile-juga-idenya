import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface OnboardingRouteProps {
	children: ReactNode;
}

function FullPageLoader() {
	return (
		<div className="min-h-screen bg-[#F9F9FB] text-neutral flex flex-col items-center justify-center p-4 font-sans">
			<p className="text-sm font-medium text-neutral/70">Memuat...</p>
		</div>
	);
}

/**
 * Guards /onboarding:
 * - unauthenticated -> /login
 * - authenticated + onboarding complete -> /dashboard (no re-onboarding)
 * - authenticated + onboarding incomplete -> allow
 */
export default function OnboardingRoute({ children }: OnboardingRouteProps) {
	const { status, isOnboardingComplete } = useAuth();

	if (status === "loading") {
		return <FullPageLoader />;
	}

	if (status === "unauthenticated") {
		return <Navigate to="/login" replace />;
	}

	if (status === "authenticated" && isOnboardingComplete()) {
		return <Navigate to="/dashboard" replace />;
	}

	return <>{children}</>;
}
