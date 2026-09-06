import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Reveal from "./Reveal";

const TARGET_VALUE = 43805;
const ANIMATION_DURATION_MS = 2000;

function easeOutQuint(t: number): number {
	return 1 - Math.pow(1 - t, 5);
}

function useCountUp(target: number, shouldStart: boolean): number {
	const [value, setValue] = useState(0);
	const hasRun = useRef(false);

	useEffect(() => {
		if (!shouldStart || hasRun.current) return;
		hasRun.current = true;

		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			const frameId = requestAnimationFrame(() => setValue(target));
			return () => cancelAnimationFrame(frameId);
		}

		let frame: number;
		const start = performance.now();

		const tick = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
			setValue(Math.round(easeOutQuint(progress) * target));

			if (progress < 1) {
				frame = requestAnimationFrame(tick);
			}
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [shouldStart, target]);

	return value;
}

function useInView<T extends HTMLElement>() {
	const ref = useRef<T | null>(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.4 },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return { ref, isInView };
}

export default function Hero() {
	const navigate = useNavigate();
	const { ref, isInView } = useInView<HTMLDivElement>();
	const count = useCountUp(TARGET_VALUE, isInView);
	const formatted = new Intl.NumberFormat("id-ID").format(count);

	return (
		<section id="masalah" className="pb-12 pt-28 px-5 sm:px-10 lg:px-20 xl:px-32 2xl:px-72 lg:pt-32">
			<Reveal>
			<div className="mx-auto flex justify-between items-start flex-col-reverse lg:flex-row gap-14 lg:gap-0">
				<div className="max-w-xl">
					<p className="mt-6 text-base text-neutral/60">
						Kenali risiko kariermu sebelum kamu dipaksa menghadapinya.
					</p>

					<h1 className="mt-8 leading-[0.95] tracking-tight text-neutral">
						<span className="block text-4xl font-bold sm:text-5xl lg:text-7xl">
							Banyak pekerja
							<br />
							sudah kena PHK.
						</span>
						<span className="mt-5 block text-4xl font-semibold sm:text-6xl lg:text-4xl">
							Kalau besok giliranmu?
						</span>
					</h1>

					<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
						<button
							type="button"
							onClick={() => navigate("/login")}
							className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90">
							Cek kondisi karierku
						</button>
						<a
							href="#solusi"
							className="text-sm text-neutral/50 transition hover:text-primary">
							Lihat cara kerjanya
						</a>
					</div>
				</div>

				<div ref={ref} className="flex flex-col justify-center items-start lg:items-end">
					<p
						aria-hidden="true"
						className="mt-3 text-6xl font-extrabold tabular-nums tracking-tight text-red-500 sm:text-7xl lg:text-8xl">
						{formatted}
					</p>
					<span className="sr-only">
						43.805 orang terkena PHK, per 25 Agustus 2026
					</span>

					<p className="mt-2 text-lg text-neutral/70">orang terkena PHK</p>
					<p className="mt-1 text-lg text-neutral/45">Per 25 Agustus 2026</p>

					<a
						href="https://www.cnbcindonesia.com/news/20260824194129-4-762060/43805-warga-ri-kena-phk-buruh-dan-pengusaha-ungkap-hal-tak-terduga"
						target="_blank"
						rel="noopener noreferrer"
						className="mt-6 inline-block text-lg text-neutral/60 underline decoration-neutral/20 underline-offset-2 transition hover:text-primary">
						Sumber: CNBC Indonesia ↗
					</a>
				</div>
			</div>
			</Reveal>
		</section>
	);
}
