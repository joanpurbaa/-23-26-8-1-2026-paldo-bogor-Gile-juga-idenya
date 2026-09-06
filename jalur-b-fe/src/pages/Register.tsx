import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { authApi } from "../services/auth";
import { ApiError } from "../types/api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
	const navigate = useNavigate();
	const { register } = useAuth();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await register({ username, email, password });
			navigate("/onboarding");
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: "Terjadi kesalahan. Silakan coba lagi.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleGoogle = () => {
		setError("");
		window.location.href = authApi.googleStart(
			`${window.location.origin}/auth/callback`,
		);
	};

	return (
		<AuthLayout
			title="Buat akun baru"
			subtitle="Mulai siapkan langkah karier terbaikmu.">
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label className="block text-sm font-medium mb-1 text-neutral">
						Username
					</label>
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="johndoe"
						className="w-full px-4 py-2.5 rounded-lg border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1 text-neutral">
						Email
					</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="nama@email.com"
						className="w-full px-4 py-2.5 rounded-lg border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-1 text-neutral">
						Password
					</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Minimal 8 karakter"
						className="w-full px-4 py-2.5 rounded-lg border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
						required
						minLength={8}
					/>
				</div>

				{error && <p className="text-xs text-red-500 font-medium">{error}</p>}

				<button
					type="submit"
					disabled={loading}
					className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:opacity-90 transition shadow-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
					{loading ? "Mendaftarkan..." : "Daftar Sekarang"}
				</button>
			</form>

			<div className="relative my-6 text-center">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-neutral/10" />
				</div>
				<span className="relative bg-white px-3 text-xs text-neutral/50 font-medium">
					atau
				</span>
			</div>

			<button
				type="button"
				onClick={handleGoogle}
				className="w-full py-2.5 border border-neutral/20 rounded-lg flex items-center justify-center gap-2 font-medium text-sm hover:bg-tertiary transition">
				<svg className="w-4 h-4" viewBox="0 0 24 24">
					<path
						fill="#4285F4"
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
					/>
					<path
						fill="#34A853"
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
					/>
					<path
						fill="#FBBC05"
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
					/>
					<path
						fill="#EA4335"
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
					/>
				</svg>
				Daftar dengan Google
			</button>

			<p className="text-center text-sm text-neutral/70 mt-6">
				Sudah punya akun?{" "}
				<Link to="/login" className="font-semibold text-primary hover:underline">
					Masuk
				</Link>
			</p>
		</AuthLayout>
	);
}
