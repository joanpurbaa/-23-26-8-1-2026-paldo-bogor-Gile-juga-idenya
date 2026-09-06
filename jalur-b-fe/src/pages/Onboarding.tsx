import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../types/api";
import { onboardingApi } from "../services/onboarding";
import { masterApi } from "../services/master";
import { cvApi } from "../services/cv";
import type { CareerGoal, OnboardingPayload } from "../types/onboarding";

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FormData {
	fullName: string;
	role: string;
	industry: string;
	experience: string;
	isFirstJob: string;
	dailyActivities: string;
	skills: string[];
	careerGoal: string;
	targetRole: string;
	targetIndustry: string;
}

export default function Onboarding() {
	const navigate = useNavigate();
	const [step, setStep] = useState<number>(1);
	const [industryDropdownOpen, setIndustryDropdownOpen] =
		useState<boolean>(false);
	const [industrySearch, setIndustrySearch] = useState<string>("");
	const [skillInput, setSkillInput] = useState<string>("");
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [masterIndustries, setMasterIndustries] = useState<string[]>([]);
	const [masterSkillSuggestions, setMasterSkillSuggestions] = useState<string[]>(
		[],
	);

	const [cvFile, setCvFile] = useState<File | null>(null);

	const [formData, setFormData] = useState<FormData>({
		fullName: "",
		role: "",
		industry: "",
		experience: "",
		isFirstJob: "",
		dailyActivities: "",
		skills: [],
		careerGoal: "",
		targetRole: "",
		targetIndustry: "",
	});

	const industries = [
		"Technology",
		"Finance",
		"Marketing",
		"Sales",
		"Design & Creative",
		"Human Resources",
	];

	const experienceOptions = [
		"Belum 1 tahun",
		"1–3 tahun",
		"3–5 tahun",
		"5–10 tahun",
		"Lebih dari 10 tahun",
	];

	const skillSuggestions = [
		"Problem Solving",
		"Communication",
		"Programming",
		"System Design",
		"Debugging",
	];

	const careerGoalOptions = [
		{
			title: "Tetap berkembang",
			desc: "Tetap di role sekarang dan meningkatkan kemampuan.",
		},
		{
			title: "Naik level",
			desc: "Mengejar posisi atau tanggung jawab yang lebih tinggi.",
		},
		{ title: "Pindah role", desc: "Mencoba pekerjaan yang berbeda." },
		{ title: "Pindah industri", desc: "Membawa skill ke industri baru." },
		{ title: "Belum tahu", desc: "Masih ingin mencari tahu pilihan yang cocok." },
	];

	const handleAddSkill = (skill: string) => {
		if (skill && !formData.skills.includes(skill) && formData.skills.length < 8) {
			setFormData({ ...formData, skills: [...formData.skills, skill] });
			setSkillInput("");
			setErrorMessage("");
		}
	};

	const handleRemoveSkill = (skillToRemove: string) => {
		setFormData({
			...formData,
			skills: formData.skills.filter((s) => s !== skillToRemove),
		});
	};

	const isStepValid = (): boolean => {
		switch (step) {
			case 1:
				return formData.fullName.trim() !== "";
			case 2:
				return formData.role.trim() !== "";
			case 3:
				return formData.industry.trim() !== "";
			case 4:
				return formData.experience !== "" && formData.isFirstJob !== "";
			case 5:
				return formData.dailyActivities.trim() !== "";
			case 6:
				return formData.skills.length > 0;
			case 7:
				return formData.careerGoal !== "";
			case 8:
				return true;
			default:
				return true;
		}
	};

	const handleNext = () => {
		if (!isStepValid()) {
			setErrorMessage("Harap isi bidang ini terlebih dahulu sebelum melanjutkan.");
			return;
		}
		setErrorMessage("");
		setStep((prev) => prev + 1);
	};

	const handleBack = () => {
		setErrorMessage("");
		setStep((prev) => prev - 1);
	};

	const experienceToMonths = (exp: string): number => {
		switch (exp) {
			case "Belum 1 tahun":
				return 6;
			case "1–3 tahun":
				return 24;
			case "3–5 tahun":
				return 48;
			case "5–10 tahun":
				return 90;
			case "Lebih dari 10 tahun":
				return 144;
			default:
				return 0;
		}
	};

	const careerGoalToEnum = (title: string): CareerGoal => {
		switch (title) {
			case "Tetap berkembang":
				return "grow_current";
			case "Naik level":
				return "level_up";
			case "Pindah role":
				return "change_role";
			case "Pindah industri":
				return "change_industry";
			case "Belum tahu":
				return "undecided";
			default:
				return "undecided";
		}
	};

	const handleFinish = async () => {
			setIsSubmitting(true);
			setErrorMessage("");
			try {
				const payload: OnboardingPayload = {
					full_name: formData.fullName,
					current_role_name: formData.role,
					industry_name: formData.industry,
					work_duration_months: experienceToMonths(formData.experience),
					is_first_job: formData.isFirstJob === "Ya",
					daily_activities: formData.dailyActivities,
					career_goal: careerGoalToEnum(formData.careerGoal),
					target_role_name: formData.targetRole.trim() || null,
					target_industry_name: formData.targetIndustry.trim() || null,
					skills: formData.skills,
				};
				await onboardingApi.complete(payload);
				localStorage.setItem("jalurB_onboarding", JSON.stringify(formData));
				if (cvFile) {
					try {
						const preview = await cvApi.preview(cvFile);
						await cvApi.confirm({
							preview_token: preview.preview_token,
							profile: preview.profile,
							skills: preview.skills,
							experiences: preview.experiences,
						});
					} catch {
						// CV bersifat opsional — kegagalan baca CV tidak menghalangi onboarding.
					}
				}
				navigate("/dashboard");
			} catch (err) {
				setErrorMessage(
					err instanceof ApiError
						? err.message
						: "Gagal menyimpan profil. Silakan coba lagi.",
				);
			} finally {
				setIsSubmitting(false);
			}
		};

	useEffect(() => {
		let active = true;
		(async () => {
			try {
				const [opts, skillsRes] = await Promise.all([
					onboardingApi.options(),
					masterApi.skills({ limit: 20 }).catch(() => null),
				]);
				if (!active) return;
				if (opts?.industries?.length) {
					setMasterIndustries(opts.industries);
				}
				const skillNames =
					skillsRes?.items?.map((s) => s.name).filter(Boolean) ?? [];
				if (skillNames.length) {
					setMasterSkillSuggestions(skillNames);
				} else if (opts?.skills?.length) {
					setMasterSkillSuggestions(opts.skills.map((s) => s.name));
				}
			} catch {
				// biarkan daftar bawaan sebagai fallback
			}
		})();
		return () => {
			active = false;
		};
	}, []);

	const industrySource = masterIndustries.length ? masterIndustries : industries;
	const skillSource = masterSkillSuggestions.length
		? masterSkillSuggestions
		: skillSuggestions;

	const filteredIndustries = industrySource.filter((i) =>
		i.toLowerCase().includes(industrySearch.toLowerCase()),
	);

	return (
		<div className="min-h-screen bg-[#F9F9FB] text-neutral flex flex-col items-center p-4 sm:p-6 font-sans">
			<div className="w-full max-w-2xl flex items-center justify-between mb-8">
				<div className="flex items-center gap-2">
					<img className="w-10 h-10 rounded-full" src="/icon.png" alt="" />
					<span className="font-semibold text-neutral">Jalur B</span>
				</div>
				<div className="flex items-center gap-4">
					<div className="flex gap-1.5">
						{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
							<div
								key={i}
								className={`h-1.5 rounded-full transition-all duration-300 ${
									i <= step ? "w-8 bg-primary" : "w-6 bg-neutral/10"
								}`}
							/>
						))}
					</div>
					<span className="text-xs text-neutral/50 font-medium">
						{step > 8 ? "8 dari 8" : `${step} dari 8`}
					</span>
				</div>
			</div>

			<div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-neutral/5">
				{step === 1 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 1
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Halo, kenalan dulu yuk!
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Boleh tahu nama lengkapmu? Kami akan memanggilmu dengan nama ini.
						</p>

						<div className="mt-8">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Nama Lengkap
							</label>
							<input
								type="text"
								placeholder="Contoh: Joan Orlando Purba"
								value={formData.fullName}
								onChange={(e) => {
									setFormData({ ...formData, fullName: e.target.value });
									if (errorMessage) setErrorMessage("");
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" && isStepValid()) {
										e.preventDefault();
										handleNext();
									}
								}}
								className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-neutral placeholder:text-neutral/40"
							/>
							<p className="text-xs text-neutral/50 mt-2">
								Nama kamu akan digunakan untuk mempersonalisasi dashboard dan
								rekomendasi kariermu.
							</p>
						</div>
					</div>
				)}

				{step === 2 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 2
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Kenalan dulu dengan kariermu.
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Saat ini kamu bekerja sebagai apa?
						</p>

						<div className="mt-8">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Role / Jabatan
							</label>
							<input
								type="text"
								placeholder="Contoh: Software Engineer, Product Manager"
								value={formData.role}
								onChange={(e) => {
									setFormData({ ...formData, role: e.target.value });
									if (errorMessage) setErrorMessage("");
								}}
								className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-neutral placeholder:text-neutral/40"
							/>
							<p className="text-xs text-neutral/50 mt-2">
								Role kamu membantu Jalur B memahami konteks pekerjaanmu.
							</p>
						</div>
					</div>
				)}

				{step === 3 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 3
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Kamu bekerja di bidang apa?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Pilih bidang yang paling mendekati pekerjaanmu.
						</p>

						<div className="mt-8 relative">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Bidang / Industri
							</label>
							<button
								type="button"
								onClick={() => setIndustryDropdownOpen(!industryDropdownOpen)}
								className="w-full px-4 py-3 rounded-2xl border border-neutral/20 text-left flex justify-between items-center text-neutral focus:outline-none focus:border-primary">
								<span
									className={formData.industry ? "text-neutral" : "text-neutral/40"}>
									{formData.industry || "Pilih bidang..."}
								</span>
								<svg
									className={`w-4 h-4 text-neutral/60 transition-transform ${
										industryDropdownOpen ? "rotate-180" : ""
									}`}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>

							{industryDropdownOpen && (
								<div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-neutral/10 shadow-lg z-20 p-2">
									<div className="flex items-center px-3 py-2 border-b border-neutral/10 mb-1">
										<svg
											className="w-4 h-4 text-neutral/40 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
										<input
											type="text"
											placeholder="Cari bidang..."
											value={industrySearch}
											onChange={(e) => setIndustrySearch(e.target.value)}
											className="w-full text-sm outline-none bg-transparent placeholder:text-neutral/40"
										/>
									</div>
									<div className="max-h-48 overflow-y-auto">
										{filteredIndustries.map((item) => (
											<button
												key={item}
												type="button"
												onClick={() => {
													setFormData({ ...formData, industry: item });
													setIndustryDropdownOpen(false);
													if (errorMessage) setErrorMessage("");
												}}
												className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${
													formData.industry === item
														? "bg-primary/10 text-primary font-medium"
														: "hover:bg-tertiary text-neutral"
												}`}>
												{item}
											</button>
										))}
									</div>
								</div>
							)}
							<p className="text-xs text-neutral/50 mt-2">
								Bidang ini membantu Jalur B memahami perubahan yang terjadi di dunia
								kerjamu.
							</p>
						</div>
					</div>
				)}

				{step === 4 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 4
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Seberapa lama kamu sudah bekerja?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Pilih yang paling mendekati.
						</p>

						<div className="mt-6 space-y-3">
							{experienceOptions.map((opt) => {
								const selected = formData.experience === opt;
								return (
									<button
										key={opt}
										type="button"
										onClick={() => {
											setFormData({ ...formData, experience: opt });
											if (errorMessage) setErrorMessage("");
										}}
										className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition ${
											selected
												? "border-primary bg-primary/5 font-medium text-neutral"
												: "border-neutral/15 hover:border-neutral/30 text-neutral"
										}`}>
										<span className="text-sm">{opt}</span>
										<div
											className={`w-5 h-5 rounded-full flex items-center justify-center border ${
												selected
													? "bg-primary border-primary text-white"
													: "border-neutral/30"
											}`}>
											{selected && (
												<svg
													className="w-3 h-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={3}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											)}
										</div>
									</button>
								);
							})}
						</div>

						<div className="mt-6">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Apakah pekerjaan ini adalah pekerjaan pertamamu?
							</label>
							<div className="grid grid-cols-2 gap-3">
								{["Ya", "Tidak"].map((opt) => {
									const selected = formData.isFirstJob === opt;
									return (
										<button
											key={opt}
											type="button"
											onClick={() => {
												setFormData({ ...formData, isFirstJob: opt });
												if (errorMessage) setErrorMessage("");
											}}
											className={`p-3.5 rounded-2xl border flex justify-between items-center transition ${
												selected
													? "border-primary bg-primary/5 font-medium text-neutral"
													: "border-neutral/15 hover:border-neutral/30 text-neutral"
											}`}>
											<span className="text-sm">{opt}</span>
											<div
												className={`w-4 h-4 rounded-full flex items-center justify-center border ${
													selected
														? "bg-primary border-primary text-white"
														: "border-neutral/30"
												}`}>
												{selected && (
													<svg
														className="w-2.5 h-2.5"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24">
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth={3}
															d="M5 13l4 4L19 7"
														/>
													</svg>
												)}
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				)}

				{step === 5 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 5
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Sehari-hari kamu mengerjakan apa?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Ceritakan dengan bahasa sehari-hari. Nggak perlu formal.
						</p>

						<div className="mt-6">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Aktivitas harianmu
							</label>
							<textarea
								rows={4}
								value={formData.dailyActivities}
								onChange={(e) => {
									setFormData({ ...formData, dailyActivities: e.target.value });
									if (errorMessage) setErrorMessage("");
								}}
								placeholder="Contoh: Aku mengurus campaign, riset pasar, membuat laporan, dan koordinasi dengan beberapa tim."
								className="w-full p-4 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral resize-none placeholder:text-neutral/40"
							/>
							<p className="text-xs text-neutral/50 mt-2">
								Ceritakan aktivitas yang paling sering kamu lakukan. Jalur B akan
								membantu memahami pola pekerjaanmu.
							</p>
						</div>
					</div>
				)}

				{step === 6 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 6
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Apa yang paling kamu kuasai?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Pilih skill yang paling menggambarkan value-mu saat ini.
						</p>

						<div className="mt-6">
							<label className="block text-xs font-semibold text-neutral mb-2">
								Skill
							</label>
							<div className="min-h-[100px] p-3 rounded-2xl border border-neutral/20 focus-within:border-primary flex flex-wrap gap-2 items-start">
								{formData.skills.map((skill) => (
									<span
										key={skill}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
										{skill}
										<button
											type="button"
											onClick={() => handleRemoveSkill(skill)}
											className="hover:opacity-70">
											<svg
												className="w-3.5 h-3.5"
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
									</span>
								))}
								<input
									type="text"
									value={skillInput}
									onChange={(e) => setSkillInput(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											handleAddSkill(skillInput.trim());
										}
									}}
									placeholder={
										formData.skills.length === 0
											? "Ketik skill lalu tekan Enter..."
											: "Tambah skill..."
									}
									className="flex-1 min-w-[140px] outline-none text-sm p-1 text-neutral placeholder:text-neutral/40"
								/>
							</div>

							<div className="flex items-center gap-2 mt-4 text-xs flex-wrap">
								<span className="text-neutral/50">Saran:</span>
								<div className="flex flex-wrap gap-2">
									{skillSource.map((sug) => (
										<button
											key={sug}
											type="button"
											onClick={() => handleAddSkill(sug)}
											className="px-3 py-1 rounded-full border border-neutral/20 text-neutral hover:bg-tertiary transition">
											+ {sug}
										</button>
									))}
								</div>
							</div>
							<p className="text-xs text-neutral/50 mt-3">
								Pilih atau ketik minimal 1 skill. Maksimal 8 skill.
							</p>
						</div>
					</div>
				)}

				{step === 7 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 7
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Kamu ingin membawa kariermu ke mana?
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Untuk 1–2 tahun ke depan, mana yang paling sesuai dengan rencanamu?
						</p>

						<div className="mt-6 space-y-3">
							{careerGoalOptions.map((opt) => {
								const selected = formData.careerGoal === opt.title;
								return (
									<button
										key={opt.title}
										type="button"
										onClick={() => {
											setFormData({ ...formData, careerGoal: opt.title });
											if (errorMessage) setErrorMessage("");
										}}
										className={`w-full p-4 rounded-2xl border text-left flex items-start justify-between transition ${
											selected
												? "border-primary bg-primary/5"
												: "border-neutral/15 hover:border-neutral/30"
										}`}>
										<div>
											<p
												className={`text-sm font-semibold ${selected ? "text-primary" : "text-neutral"}`}>
												{opt.title}
											</p>
											<p className="text-xs text-neutral/60 mt-0.5">{opt.desc}</p>
										</div>
										<div
											className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 ${
												selected
													? "bg-primary border-primary text-white"
													: "border-neutral/30"
											}`}>
											{selected && (
												<svg
													className="w-3 h-3"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={3}
														d="M5 13l4 4L19 7"
													/>
												</svg>
											)}
										</div>
									</button>
								);
							})}
						</div>

						<div className="mt-6 space-y-4">
							<div>
								<label className="block text-xs font-semibold text-neutral mb-1">
									Role yang kamu incar (opsional)
								</label>
								<input
									type="text"
									value={formData.targetRole}
									onChange={(e) =>
										setFormData({ ...formData, targetRole: e.target.value })
									}
									placeholder="Contoh: Tech Lead, Senior Marketing Specialist"
									className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary text-sm text-neutral placeholder:text-neutral/40"
								/>
							</div>

							<div>
								<label className="block text-xs font-semibold text-neutral mb-1">
									Industri yang kamu incar (opsional)
								</label>
								<input
									type="text"
									value={formData.targetIndustry}
									onChange={(e) =>
										setFormData({ ...formData, targetIndustry: e.target.value })
									}
									placeholder="Contoh: FinTech, E-Commerce"
									className="w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary text-sm text-neutral placeholder:text-neutral/40"
								/>
							</div>
							<p className="text-xs text-neutral/50">
								Belum punya target? Nggak apa-apa. Kamu bisa mengisinya nanti.
							</p>
						</div>
					</div>
				)}

				{step === 8 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							Langkah 8
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Lampirkan CV kamu? (opsional)
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Bisa membantu Jalur B membaca pengalaman kariermu lebih detail.
							Boleh dilewati dulu, kamu bisa mengunggahnya nanti dari halaman
							Profil.
						</p>

						<div className="mt-8">
							{cvFile ? (
								<div className="flex items-center gap-4 p-4 rounded-2xl border border-primary/20 bg-primary/5">
									<div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
										<svg
											className="w-5 h-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
											/>
										</svg>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-neutral truncate">
											{cvFile.name}
										</p>
										<p className="text-xs text-neutral/50">
											{formatFileSize(cvFile.size)}
										</p>
									</div>
									<button
										type="button"
										onClick={() => setCvFile(null)}
										className="text-xs font-semibold text-primary hover:opacity-70">
										Hapus
									</button>
								</div>
							) : (
								<div>
									<input
										id="cv-upload"
										type="file"
										accept=".pdf,.doc,.docx"
										onChange={(e) => {
											const file = e.target.files?.[0] ?? null;
											setCvFile(file);
											if (errorMessage) setErrorMessage("");
										}}
										className="sr-only"
									/>
									<label
										htmlFor="cv-upload"
										className="flex flex-col items-center justify-center w-full p-8 rounded-2xl border-2 border-dashed border-neutral/20 hover:border-primary/40 transition cursor-pointer text-center">
										<svg
											className="w-8 h-8 text-neutral/40 mb-3"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
											/>
										</svg>
										<p className="text-sm font-semibold text-neutral">
											Klik untuk memilih file CV
										</p>
										<p className="text-xs text-neutral/50 mt-1">
											PDF, DOC, atau DOCX — maksimal 5 MB
										</p>
									</label>
								</div>
							)}
						</div>

						{cvFile && (
							<p className="text-xs text-neutral/50 mt-3">
								CV akan dibaca setelah profil tersimpan. Hasilnya bisa kamu
								cek di halaman Profil.
							</p>
						)}

						<p className="text-xs text-neutral/50 mt-3">
							Unggah CV bersifat opsional. Kamu tetap bisa melanjutkan tanpa
							melampirkan CV.
						</p>
					</div>
				)}

				{step === 9 && (
					<div>
						<span className="text-xs font-bold text-primary tracking-wider uppercase">
							SELESAI
						</span>
						<h1 className="text-2xl sm:text-3xl font-bold mt-2 text-neutral">
							Profil kariermu sudah siap,{" "}
							{formData.fullName.trim()
								? formData.fullName.split(" ")[0]
								: ""}{" "}
							👋
						</h1>
						<p className="text-sm text-neutral/60 mt-1">
							Ini gambaran awal yang kami dapat dari jawabanmu.
						</p>

						<div className="mt-6 p-6 rounded-2xl bg-tertiary/60 border border-neutral/10 space-y-4">
							<div>
								<h3 className="text-lg font-bold text-neutral capitalize">
									{formData.fullName.trim() || "Belum diisi"}
								</h3>
								<p className="text-xs text-neutral/60 mt-0.5">
									{formData.role || "Belum diisi"} ·{" "}
									{formData.industry || "Belum diisi"} ·{" "}
									{formData.experience || "-"} pengalaman
								</p>
							</div>

							<div>
								<span className="text-xs text-neutral/50 block mb-1.5">Skills</span>
								<div className="flex flex-wrap gap-2">
									{formData.skills.map((s) => (
										<span
											key={s}
											className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
											{s}
										</span>
									))}
								</div>
							</div>

							<div className="pt-2 border-t border-neutral/10 space-y-2 text-xs">
								<div className="flex justify-between py-1">
									<span className="text-neutral/50">Pekerjaan pertama</span>
									<span className="font-semibold text-neutral">
										{formData.isFirstJob || "-"}
									</span>
								</div>
								<div className="flex justify-between py-1 border-t border-neutral/5">
									<span className="text-neutral/50">Arah karier</span>
									<span className="font-semibold text-neutral">
										{formData.careerGoal || "-"}
									</span>
								</div>
								<div className="flex justify-between py-1 border-t border-neutral/5">
									<span className="text-neutral/50">Role incaran</span>
									<span className="font-semibold text-neutral">
										{formData.targetRole || "-"}
									</span>
								</div>
								<div className="flex justify-between py-1 border-t border-neutral/5">
									<span className="text-neutral/50">Industri incaran</span>
									<span className="font-semibold text-neutral">
										{formData.targetIndustry || "-"}
									</span>
								</div>
							</div>
						</div>

						<p className="text-xs text-neutral/50 mt-6 leading-relaxed">
							Jalur B akan menggunakan profil ini untuk membaca kesehatan karier,
							risiko pekerjaan, relevansi skill, dan peluang karier alternatifmu.
						</p>
					</div>
				)}

				{errorMessage && (
					<p className="text-xs text-red-500 font-medium mt-4">{errorMessage}</p>
				)}

				<div className="mt-8 pt-6 border-t border-neutral/10 flex items-center justify-between">
					{step > 1 ? (
						<button
							type="button"
							onClick={handleBack}
							className="flex items-center gap-2 text-sm font-medium text-neutral/70 hover:text-neutral transition cursor-pointer">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Kembali
						</button>
					) : (
						<div />
					)}

					{step < 9 ? (
						<button
							type="button"
							onClick={handleNext}
							disabled={!isStepValid()}
							className={`px-6 py-2.5 text-sm font-medium rounded-full transition flex items-center gap-2 shadow-sm ${
								isStepValid()
									? "bg-primary text-white hover:opacity-90 cursor-pointer"
									: "bg-neutral/20 text-neutral/40 cursor-not-allowed"
							}`}>
							Lanjut
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					) : (
						<button
							type="button"
							onClick={() => handleFinish()}
							disabled={isSubmitting}
							className={`px-6 py-2.5 text-white text-sm font-medium rounded-full transition flex items-center gap-2 shadow-sm ${
								isSubmitting
									? "bg-primary/70 cursor-not-allowed"
									: "bg-primary hover:opacity-90 cursor-pointer"
							}`}>
							{isSubmitting ? "Menyimpan..." : "Lihat Dashboard"}
							{isSubmitting ? null : (
								<svg
									className="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 5l7 7-7 7"
									/>
								</svg>
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
