import { useCallback, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import FinancialRunwayHero from "./FinancialRunwayHero";
import FinancialProfileCard from "./FinancialProfileCard";
import FinancialParameters from "./FinancialParameters";
import { financialApi, parseRunwayMonths } from "../../services/financial";

function runwayDescription(current: number, target: number): string {
	if (current <= 0)
		return "Lengkapi parameter finansial untuk menghitung ketahanan keuanganmu.";
	const gap = target - current;
	if (gap <= 0)
		return "Ketahanan finansialmu sudah berada di atas target minimum. Pertahankan!";
	return `Ketahanan finansialmu masih ${current.toFixed(
		1,
	)} bulan, butuh memperkuat posisi agar menyentuh target minimum ${target.toFixed(
		1,
	)} bulan.`;
}

export default function Finansial() {
	const [runway, setRunway] = useState<{
		current: number;
		target: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);

	const refresh = useCallback(async () => {
		try {
			const res = await financialApi.getOrCreate();
			setRunway(parseRunwayMonths(res.runway));
			setLoading(false);
		} catch {
			setRunway(null);
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		let active = true;
		financialApi
			.getOrCreate()
			.then((res) => {
				if (active) setRunway(parseRunwayMonths(res.runway));
			})
			.catch(() => {
				if (active) setRunway(null);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const description = runway
		? runwayDescription(runway.current, runway.target)
		: null;

	return (
		<div>
			<PageHeader
				title="Finansial"
				subtitle="Pahami kesiapan finansialmu jika sewaktu-waktu kehilangan income."
			/>

			<FinancialRunwayHero
				runway={
					runway ? { ...runway, description } : null
				}
				loading={loading}
			/>
			<FinancialProfileCard onChanged={refresh} />
			<FinancialParameters onChanged={refresh} />

			<div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-neutral/10">
				<Lock size={12} className="text-neutral/40" />
				<p className="text-xs text-neutral/50">
					Data finansialmu bersifat privat dan hanya digunakan untuk menghitung
					financial runway.
				</p>
			</div>
		</div>
	);
}
