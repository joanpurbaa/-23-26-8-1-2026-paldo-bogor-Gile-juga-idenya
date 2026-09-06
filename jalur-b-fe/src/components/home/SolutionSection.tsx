import Reveal from "./Reveal";

const STEPS = [
	{
		number: "01",
		title: "Pahami",
		description: "Kenali kondisi kariermu saat ini.",
	},
	{
		number: "02",
		title: "Ukur",
		description: "Ukur risiko, relevansi skill, dan ketahanan finansialmu.",
	},
	{
		number: "03",
		title: "Siapkan",
		description: "Temukan jalur karier alternatif dan bangun bukti kemampuan.",
	},
	{
		number: "04",
		title: "Bertahan",
		description:
			"Ketahui apa yang harus dilakukan ketika pendapatan atau pekerjaan berubah.",
	},
];

export default function SolutionSection() {
	return (
		<section id="solusi" className="mx-auto px-5 sm:px-10 lg:px-20 xl:px-32 2xl:px-72 py-16 lg:py-24">
			<Reveal>
			<div className="max-w-full">
				<h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral sm:text-5xl lg:text-6xl leading-[1.02] font-[Georgia,serif] italic">
					Jangan tunggu kehilangan pekerjaan untuk mulai bersiap.
				</h2>

				<p className="mt-6 max-w-xl text-base text-neutral/60 sm:text-lg">
					Jalur B membantu kamu melihat risiko karier, memahami perubahan skill,
					menjaga kondisi finansial, dan menyiapkan jalur alternatif sebelum semuanya
					terlambat.
				</p>
			</div>
			</Reveal>

			<ol className="mt-14 grid grid-cols-1 gap-y-10 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-0">
				{STEPS.map((step, index) => (
					<Reveal key={step.number} delay={index * 80}>
					<li
						className="group border-t-2 border-neutral/10 pt-6 transition-colors duration-300 hover:border-primary">
						<span className="text-5xl font-bold tracking-tight text-neutral/15 transition-colors duration-300 group-hover:text-primary lg:text-6xl">
							{step.number}
						</span>
						<h3 className="mt-5 text-xl font-bold text-neutral">{step.title}</h3>
						<p className="mt-2.5 max-w-xs text-sm leading-relaxed text-neutral/60">
							{step.description}
						</p>
					</li>
					</Reveal>
				))}
			</ol>

			<Reveal delay={120}>
			<div className="mt-16 max-w-4xl border-t-2 border-neutral/10 pt-9">
				<p className="text-3xl font-bold tracking-tight text-neutral leading-[1.1] sm:text-4xl lg:text-5xl">
					Karena punya <span className="italic text-primary">rencana B</span> lebih
					baik
					<br />
					daripada{" "}
					<span className="font-normal italic text-neutral/50">
						tidak punya pilihan.
					</span>
				</p>
			</div>
			</Reveal>
		</section>
	);
}
