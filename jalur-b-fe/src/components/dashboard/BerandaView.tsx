import { useEffect, useState } from "react";
import PageHeader from "../layouts/PageHeader";
import CareerHealthCard from "./CareerHealthCard";
import CareerSnapshotGrid from "./CareerSnapshotGrid";
import WeeklyFocusAndMission from "./WeeklyFocusAndMission";
import { dashboardApi } from "../../services/dashboard";
import { useAuth } from "../../context/AuthContext";

export default function BerandaView() {
	const { user } = useAuth();
	const [displayName, setDisplayName] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		dashboardApi
			.get()
			.then((res) => {
				if (active)
					setDisplayName(
						res.profile?.full_name || res.account.username || null,
					);
			})
			.catch(() => {
				// fallback ke data auth user tanpa menggagalkan halaman
			});
		return () => {
			active = false;
		};
	}, []);

	const name = displayName || user?.username || "—";

	return (
		<div>
			<PageHeader
				title={`Selamat datang kembali, ${name}.`}
				subtitle="Berikut kondisi kariermu minggu ini."
			/>
			<CareerHealthCard />
			<CareerSnapshotGrid />
			<WeeklyFocusAndMission />
		</div>
	);
}