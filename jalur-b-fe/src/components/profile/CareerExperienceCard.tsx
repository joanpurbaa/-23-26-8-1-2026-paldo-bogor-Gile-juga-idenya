import { useEffect, useRef, useState } from "react";
import { Briefcase, Upload } from "lucide-react";
import SkillPill from "../ui/SkillPill";
import Skeleton from "../ui/Skeleton";
import { SecondaryButton } from "../ui/PrimaryButton";
import { ApiError } from "../../types/api";
import { cvApi } from "../../services/cv";
import type { CvGetResponse, CvPreviewResponse } from "../../types/cv";
import type { OnboardingSkill } from "../../types/onboarding";

interface CareerExperienceCardProps {
	skills?: OnboardingSkill[];
	loading?: boolean;
}

export default function CareerExperienceCard({
	skills,
	loading = false,
}: CareerExperienceCardProps) {
	const [cvData, setCvData] = useState<CvGetResponse | null>(null);
	const [cvLoading, setCvLoading] = useState(true);
	const [cvPreview, setCvPreview] = useState<CvPreviewResponse | null>(null);
	const [cvUploading, setCvUploading] = useState(false);
	const [cvError, setCvError] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		let active = true;
		cvApi
			.get()
			.then((res) => {
				if (active) setCvData(res);
			})
			.catch(() => {
				// belum ada CV — biarkan null
			})
			.finally(() => {
				if (active) setCvLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleFile = (file: File) => {
		setCvError("");
		setCvUploading(true);
		cvApi
			.preview(file)
			.then((res) => {
				setCvPreview(res);
			})
			.catch((err) => {
				setCvError(
					err instanceof ApiError
						? err.message
						: "Gagal membaca CV. Coba dengan file lain.",
				);
			})
			.finally(() => {
				setCvUploading(false);
			});
	};

	const handleConfirm = () => {
		if (!cvPreview) return;
		setCvUploading(true);
		setCvError("");
		cvApi
			.confirm({
				preview_token: cvPreview.preview_token,
				profile: cvPreview.profile,
				skills: cvPreview.skills,
				experiences: cvPreview.experiences,
			})
			.then(() => {
				setCvPreview(null);
				setCvLoading(true);
				return cvApi.get();
			})
			.then((res) => {
				setCvData(res);
			})
			.catch((err) => {
				setCvError(
					err instanceof ApiError
						? err.message
						: "Gagal menyimpan CV. Silakan coba lagi.",
				);
			})
			.finally(() => {
				setCvUploading(false);
			});
	};

	const handleReset = () => {
		setCvPreview(null);
		setCvError("");
	};

	const hasCv = cvData !== null;
	const showPreview = cvPreview !== null;

	if (loading || cvLoading) {
		return (
			<div>
				<div className="space-y-3 mb-6">
					<Skeleton className="h-16 w-full rounded-xl" />
					<Skeleton className="h-16 w-full rounded-xl" />
				</div>
				<div className="flex flex-wrap gap-2 mb-6">
					<Skeleton className="h-8 w-24 rounded-lg" />
					<Skeleton className="h-8 w-20 rounded-lg" />
					<Skeleton className="h-8 w-28 rounded-lg" />
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="flex items-center gap-2 mb-4">
				<Briefcase size={15} className="text-primary/60" />
				<h4 className="text-sm font-bold text-neutral">Pengalaman Karier</h4>
			</div>

			{hasCv && !showPreview && cvData ? (
				<div className="space-y-5 mb-6">
					{cvData.experiences.length > 0 ? (
						cvData.experiences.map((exp, i) => (
							<div key={`cv-exp-${i}`} className="border-l-2 border-primary/20 pl-4">
								<div className="flex items-center justify-between flex-wrap gap-1">
									<p className="text-sm font-bold text-neutral">
										{exp.role}
									</p>
									<span className="text-xs text-neutral/50">
										{exp.start_date} — {exp.end_date}
									</span>
								</div>
								<p className="text-xs text-neutral/50 font-medium">
									{exp.company}
								</p>
								<p className="text-xs text-neutral/60 mt-1 leading-relaxed">
									{exp.description}
								</p>
							</div>
						))
					) : (
						<p className="text-xs text-neutral/50">
							Tidak ada pengalaman yang terdeteksi dari CV.
						</p>
					)}
				</div>
			) : showPreview && cvPreview ? (
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-3">
						<div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<div>
							<p className="text-sm font-bold text-neutral">
								Preview dari CV
							</p>
							<p className="text-xs text-neutral/50">
								{cvPreview.file_name}
							</p>
						</div>
					</div>

					{cvPreview.experiences.length > 0 && (
						<div className="space-y-3 mb-4">
							{cvPreview.experiences.map((exp, i) => (
								<div
									key={`preview-exp-${i}`}
									className="border-l-2 border-primary/20 pl-4">
									<p className="text-sm font-bold text-neutral">
										{exp.role}
									</p>
									<p className="text-xs text-neutral/50 font-medium">
										{exp.company} · {exp.start_date} — {exp.end_date}
									</p>
									<p className="text-xs text-neutral/60 mt-1 leading-relaxed">
										{exp.description}
									</p>
								</div>
							))}
						</div>
					)}

					{cvPreview.skills.length > 0 && (
						<div className="flex flex-wrap gap-1.5 mb-4">
							{cvPreview.skills.map((skill) => (
								<SkillPill key={skill} label={skill} tone="neutral" />
							))}
						</div>
					)}

					<div className="flex gap-2">
						<button
							type="button"
							onClick={handleConfirm}
							disabled={cvUploading}
							className={`px-4 py-2 text-xs font-semibold rounded-xl transition ${
								cvUploading
									? "bg-primary/50 text-white cursor-not-allowed"
									: "bg-primary text-white hover:opacity-90 cursor-pointer"
							}`}>
							{cvUploading ? "Menyimpan…" : "Gunakan data ini"}
						</button>
						<button
							type="button"
							onClick={handleReset}
							disabled={cvUploading}
							className="px-4 py-2 text-xs font-semibold text-neutral/60 border border-neutral/20 rounded-xl hover:bg-neutral/5 transition cursor-pointer">
							Batal
						</button>
					</div>
				</div>
			) : (
				<p className="text-xs text-neutral/50 mb-4">
					Belum ada pengalaman karier yang tercatat.
				</p>
			)}

			<h4 className="text-sm font-bold text-neutral mb-3">Skill</h4>

			{skills && skills.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{skills.map((skill) => (
						<SkillPill key={skill.id} label={skill.name} tone="neutral" />
					))}
				</div>
			) : (
				<p className="text-xs text-neutral/50">Belum ada skill yang dicatat.</p>
			)}

			<div className="mt-6 pt-5 border-t border-neutral/10">
				<div className="flex items-center justify-between flex-wrap gap-3">
					<div className="min-w-0 flex-1">
						{hasCv && !showPreview ? (
							<>
								<p className="text-xs font-semibold text-neutral mb-1">
									CV terlampir
								</p>
								<div className="flex items-center gap-2">
									<span className="text-xs text-neutral/50">
										Diunggah{" "}
										{new Date(cvData!.uploaded_at).toLocaleDateString("id-ID", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</span>
									<span className="text-xs text-neutral/40">·</span>
									<span className="text-xs text-neutral/50 capitalize">
										Model: {cvData!.model}
									</span>
								</div>
							</>
						) : showPreview ? (
							<p className="text-xs text-neutral/50">
								Gunakan data di atas, atau batalkan untuk mengunggah file
								lain.
							</p>
						) : (
							<span className="text-xs font-semibold text-neutral mb-1">
								CV
							</span>
						)}
					</div>

					{!showPreview && (
						<>
							<SecondaryButton
								icon={<Upload size={14} className="text-primary" />}
								onClick={() => fileInputRef.current?.click()}>
								{cvUploading
									? "Memproses..."
									: hasCv
										? "Ganti CV"
										: "Unggah CV"}
							</SecondaryButton>

							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf,.doc,.docx"
								className="sr-only"
								onChange={(e) => {
									const file = e.target.files?.[0];
									if (file) handleFile(file);
									e.target.value = "";
								}}
							/>
						</>
					)}
				</div>

				{cvError && (
					<p className="text-xs text-red-500 font-medium mt-2">{cvError}</p>
				)}

				{!hasCv && !showPreview && (
					<p className="text-xs text-neutral/50 mt-2">
						Unggah CV bersifat opsional untuk melengkapi profil kariermu.
					</p>
				)}
			</div>
		</div>
	);
}
