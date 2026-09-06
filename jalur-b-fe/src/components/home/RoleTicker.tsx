const SOURCE_URL =
	"https://www.cbsnews.com/news/anthropic-ai-jobs-most-exposed-risk/";

const ROLES = [
	{ role: "Computer Programmer", value: "75%" },
	{ role: "Customer Service Representative", value: "70%" },
	{ role: "Data Entry Clerk", value: "67%" },
	{ role: "Medical Records Specialist", value: "67%" },
	{ role: "Market Research Analyst & Marketing Specialist", value: "65%" },
	{ role: "Sales Representative", value: "63%" },
	{ role: "Financial & Investment Analyst", value: "57%" },
	{ role: "Software QA Analyst", value: "52%" },
	{ role: "Information Security Analyst", value: "49%" },
	{ role: "Computer User Support Specialist", value: "47%" },
];

export default function RoleTicker() {
	return (
		<section className="mt-12 px-5 sm:px-10 lg:px-20 xl:px-32 2xl:px-72">
			<div className="mb-5 flex items-center gap-3">
				<a
					href={SOURCE_URL}
					target="_blank"
					rel="noopener noreferrer"
					title="Data berasal dari riset Anthropic"
					className="shrink-0 transition hover:opacity-80">
					<img
						src="/claude.webp"
						alt="Anthropic Claude"
						className="h-8 w-8 rounded-lg object-contain"
					/>
				</a>
				<div>
					<p className="text-xl font-bold text-neutral">
						10 profesi paling terdampak AI
					</p>
					<p className="mt-0.5 text-sm text-neutral/50">
						Diidentifikasi <u>Anthropic</u> sebagai profesi dengan paparan AI
						tertinggi{" "}
						<a
							href={SOURCE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="font-medium text-neutral/60 underline decoration-neutral/20 underline-offset-2 transition hover:text-primary">
							Sumber ↗
						</a>
					</p>
				</div>
			</div>

			<div className="group relative overflow-hidden">
				<div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
					{[...ROLES, ...ROLES].map((item, index) => (
						<a
							key={`${item.role}-${index}`}
							href={SOURCE_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="mx-3 whitespace-nowrap rounded-full border border-neutral/40 bg-transparent px-6 py-2.5 text-sm font-medium text-neutral/60 transition-colors duration-200 hover:border-primary hover:text-primary">
							{item.role}
							<span className="ml-2 font-semibold text-neutral/60 transition-colors duration-200 hover:text-primary font-[Georgia,serif]">
								{item.value}
							</span>
						</a>
					))}
				</div>

				<div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-white to-transparent" />
				<div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-white to-transparent" />
			</div>
		</section>
	);
}
