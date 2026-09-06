export default function PreparedVideoBanner() {
	return (
		<section className="mt-12">
			<div className="relative w-full overflow-hidden bg-neutral/5">
				<video
					src="/video2.mp4"
					autoPlay
					muted
					loop
					playsInline
					className="block h-[400px] w-full object-cover"
				/>

				<div className="absolute inset-0 bg-slate-900/50 mix-blend-multiply" />

				<div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
					<p className="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
						Jangan tunggu tergantikan.
					</p>
					<p className="mt-1 font-['Georgia',serif] text-2xl font-normal italic text-white sm:text-3xl lg:text-4xl">
						Siapkan jalur berikutnya.
					</p>
				</div>
			</div>
		</section>
	);
}