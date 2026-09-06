import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../types/api";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
	const navigate = useNavigate();
	const { completeGoogle } = useAuth();
	const done = useRef(false);

	useEffect(() => {
		// Guard against double-execution (StrictMode) since the OAuth code is single-use.
		if (done.current) return;
		done.current = true;

		// The backend redirects the OAuth code in the URL fragment (e.g. /auth/callback#code=...).
		const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
		const code = hashParams.get("code");
		const error = hashParams.get("error");

		if (error || !code) {
			console.log("[AUTH] Google callback received without code:", {
				error,
				hasCode: Boolean(code),
			});
			navigate("/login", {
				replace: true,
				state: { error: "Gagal login dengan Google." },
			});
			return;
		}

		(async () => {
			try {
				await completeGoogle(code);
				console.log("[AUTH] redirect destination: /onboarding (guard resolves)");
				navigate("/onboarding", { replace: true });
			} catch (err) {
				const message =
					err instanceof ApiError
						? err.message
						: "Gagal masuk dengan Google.";
				console.log("[AUTH] Google exchange failed, redirecting to /login");
				navigate("/login", { replace: true, state: { error: message } });
			}
		})();
	}, [navigate, completeGoogle]);

	return (
		<div className="min-h-screen bg-[#F9F9FB] text-neutral flex flex-col items-center justify-center p-4 font-sans">
			<p className="text-sm font-medium text-neutral/70">
				Menghubungkan akun Google...
			</p>
		</div>
	);
}
