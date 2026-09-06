import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	Home,
	HeartPulse,
	AlertTriangle,
	GitFork,
	FolderCheck,
	Wallet,
	PlaySquare,
	User,
	LogOut,
	ChevronLeft,
	ChevronRight,
  Zap,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCareerAssessment } from "../../context/CareerAssessmentContext";

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { logout } = useAuth();
	const { openCareerAssessment } = useCareerAssessment();

	const currentPath = location.pathname.split("/")[2] || "beranda";

	const mainNavItems = [
		{ id: "beranda", label: "Beranda", icon: Home },
		{ id: "kesehatan-karier", label: "Kesehatan Karier", icon: HeartPulse },
		{ id: "risiko-karier", label: "Risiko Karier", icon: AlertTriangle },
		{ id: "skill", label: "Skill", icon: Zap },
		{ id: "jalur-karier", label: "Jalur Karier", icon: GitFork },
		{ id: "bukti-karier", label: "Bukti Karier", icon: FolderCheck },
		{ id: "finansial", label: "Finansial", icon: Wallet },
		{ id: "simulasi", label: "Simulasi", icon: PlaySquare },
	];

	const bottomNavItems = [
		{ id: "profil", label: "Profil", icon: User },
		{ id: "keluar", label: "Keluar", icon: LogOut },
	];

	const handleNavigation = (id: string) => {
		if (id === "keluar") {
			setIsLogoutModalOpen(true);
			return;
		}
		navigate(`/dashboard/${id}`);
	};

	const handleLogout = async () => {
		setIsLogoutModalOpen(false);
		await logout();
		navigate("/login");
	};

	return (
		<aside
			className={`sticky top-0 h-screen bg-white border-r border-neutral/10 flex flex-col justify-between transition-all duration-300 p-4 shrink-0 z-30 ${
				isCollapsed ? "w-20" : "w-64"
			}`}>
			<button
				type="button"
				onClick={() => setIsCollapsed(!isCollapsed)}
				className="absolute -right-3 top-7 bg-white border border-neutral/20 rounded-full p-1 text-neutral/60 hover:text-primary shadow-sm transition z-40 cursor-pointer">
				{isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
			</button>

			<div className="flex flex-col min-h-0">
				<div className="flex items-center gap-3 px-2 py-3 mb-6 shrink-0">
      <img src="/icon.png" className="w-10 h-10 rounded-full" alt="" />
					{!isCollapsed && (
						<div>
							<h2 className="font-bold text-neutral leading-tight">Jalur B</h2>
							<p className="text-[10px] text-neutral/50 font-medium">
								Career Resilience
							</p>
						</div>
					)}
				</div>

				<nav className="space-y-1 overflow-y-auto pr-1">
					{mainNavItems.map((item) => {
						const Icon = item.icon;
						const isActive = currentPath === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => handleNavigation(item.id)}
								className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
									isActive
										? "bg-primary text-white shadow-sm"
										: "text-neutral/70 hover:bg-neutral/5 hover:text-neutral"
								}`}>
								<Icon
									size={18}
									className={isActive ? "text-white" : "text-neutral/60"}
								/>
								{!isCollapsed && <span>{item.label}</span>}
							</button>
						);
					})}
				</nav>
			</div>

			<div className="space-y-4 pt-4 border-t border-neutral/10 shrink-0">
				<button
					type="button"
					onClick={openCareerAssessment}
					title={isCollapsed ? "Lengkapi Data Karier" : undefined}
					className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-primary text-white shadow-sm hover:opacity-90 transition cursor-pointer ${
						isCollapsed ? "justify-center" : ""
					}`}>
					<ClipboardList size={18} />
					{!isCollapsed && <span>Lengkapi Data Karier</span>}
				</button>

				<nav className="space-y-1">
					{bottomNavItems.map((item) => {
						const Icon = item.icon;
						const isActive = currentPath === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => handleNavigation(item.id)}
								className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
									isActive
										? "bg-primary text-white shadow-sm"
										: "text-neutral/70 hover:bg-neutral/5 hover:text-neutral"
								}`}
								title={isCollapsed ? item.label : undefined}>
								<Icon
									size={18}
									className={isActive ? "text-white" : "text-neutral/60"}
								/>
								{!isCollapsed && <span>{item.label}</span>}
							</button>
						);
					})}
				</nav>
			</div>

			{isLogoutModalOpen && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral/40 backdrop-blur-sm"
					onClick={() => setIsLogoutModalOpen(false)}>
					<div
						className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral/5"
						onClick={(e) => e.stopPropagation()}>
						<div className="flex items-start justify-between mb-4">
							<div>
								<h2 className="text-xl font-bold text-neutral">
									Keluar dari Jalur B?
								</h2>
								<p className="text-sm text-neutral/60 mt-1">
									Kamu akan diarahkan ke halaman login. Lanjutkan?
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsLogoutModalOpen(false)}
								className="text-neutral/40 hover:text-neutral transition cursor-pointer">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>

						<div className="flex items-center justify-end gap-3 mt-6">
							<button
								type="button"
								onClick={() => setIsLogoutModalOpen(false)}
								className="px-5 py-2.5 text-sm font-medium rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition cursor-pointer">
								Batal
							</button>
							<button
								type="button"
								onClick={handleLogout}
								className="px-5 py-2.5 bg-red-500 text-white text-sm font-semibold rounded-full hover:opacity-90 transition shadow-sm cursor-pointer">
								Keluar
							</button>
						</div>
					</div>
				</div>
			)}
		</aside>
	);
}
