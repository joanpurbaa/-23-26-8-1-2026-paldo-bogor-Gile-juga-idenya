/** Nilai dari backend berupa string desimal berpresisi tinggi — amankan parsing. */
export function parseDecimal(value: string | number): number {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}