import React from "react";

interface AuthLayoutProps {
	children: React.ReactNode;
	title: string;
	subtitle: string;
}

export default function AuthLayout({
	children,
	title,
	subtitle,
}: AuthLayoutProps) {
	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-neutral">
			<div className="hidden lg:flex flex-col justify-between p-12 bg-tertiary relative overflow-hidden">
				<div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

				<div className="relative z-10">
					<div className="flex items-center gap-3">
						<img
							src="/icon.png"
							alt="Jalur B Logo"
							className="w-8 h-8 object-contain"
						/>
						<span className="font-bold text-xl text-primary tracking-tight">
							Jalur B
						</span>
					</div>

					<div className="mt-20 max-w-lg">
						<h1 className="text-4xl font-extrabold tracking-tight leading-tight text-neutral">
							Kariermu hari ini bukan jaminan kariermu besok.
						</h1>
						<p className="mt-4 text-base text-neutral/70 leading-relaxed">
							Jalur B membantu kamu memahami risiko, meningkatkan kemampuan, dan
							menyiapkan langkah berikutnya sebelum kamu membutuhkannya.
						</p>
					</div>
				</div>

				<div className="relative z-10 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-neutral/10 shadow-sm max-w-md">
					<div className="flex items-center gap-2 mb-2">
						<span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
						<span className="text-xs font-semibold uppercase tracking-wider text-neutral/60">
							Career Risk Mitigation
						</span>
					</div>
					<p className="text-sm font-medium text-neutral">
						"Satu-satunya cara bertahan di era AI adalah punya Plan B yang selalu
						lebih siap dari Plan A."
					</p>
				</div>
			</div>

			<div className="flex items-center justify-center p-6 sm:p-12">
				<div className="w-full max-w-md space-y-6">
					<div className="lg:hidden flex items-center gap-3 mb-6">
						<img
							src="/icon.png"
							alt="Jalur B Logo"
							className="w-8 h-8 object-contain"
						/>
						<span className="font-bold text-xl text-primary">Jalur B</span>
					</div>

					<div>
						<h2 className="text-2xl font-bold tracking-tight text-neutral">
							{title}
						</h2>
						<p className="text-sm text-neutral/60 mt-1">{subtitle}</p>
					</div>

					{children}
				</div>
			</div>
		</div>
	);
}
