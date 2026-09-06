import {
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { PlusCircle } from "lucide-react";
import { PrimaryButton } from "../ui/PrimaryButton";
import { evidenceTypeLabels } from "../../lib/evidence";
import { profileApi } from "../../services/profile";
import type { EvidenceItemCreate, EvidenceType } from "../../types/evidence";

const inputClass =
	"w-full px-4 py-3 rounded-2xl border border-neutral/20 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm text-neutral placeholder:text-neutral/40";

export interface EvidenceFormHandle {
	open: () => void;
}

interface EvidenceFormProps {
	onSave: (
		payload: EvidenceItemCreate,
		file?: File | null,
	) => Promise<unknown> | void;
}

function getOnboardingRole(): string {
	try {
		const raw = localStorage.getItem("jalurB_onboarding");
		if (!raw) return "";
		const data = JSON.parse(raw) as { role?: string };
		return data.role ?? "";
	} catch {
		return "";
	}
}

const EvidenceForm = forwardRef<EvidenceFormHandle, EvidenceFormProps>(
	({ onSave }, ref) => {
		const [evidenceType, setEvidenceType] = useState("");
		const [title, setTitle] = useState("");
		const [description, setDescription] = useState("");
		const [impact, setImpact] = useState("");
		const [date, setDate] = useState("");
		const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
		const [saving, setSaving] = useState(false);
		const [saveError, setSaveError] = useState("");
		const titleRef = useRef<HTMLInputElement>(null);

		useImperativeHandle(ref, () => ({
			open: () => {
				titleRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
				setTimeout(() => titleRef.current?.focus(), 50);
			},
		}));

		const canSave = evidenceType !== "" && title.trim().length > 0;

		const reset = () => {
			setEvidenceType("");
			setTitle("");
			setDescription("");
			setImpact("");
			setDate("");
			setAttachmentFile(null);
			setSaveError("");
		};

		const handleSave = async () => {
			if (saving) return;
			setSaving(true);
			setSaveError("");
			try {
				// Role/jabatan tidak diinput manual — diambil dari profile.
				const profile = await profileApi.get().catch(() => null);
				const userRole =
					profile?.profile?.current_role_name?.trim() ||
					getOnboardingRole().trim();

				await onSave(
					{
						evidence_type: evidenceType as EvidenceType,
						title: title.trim(),
						user_role: userRole,
						description: description.trim(),
						impact: impact.trim() || "Dampak belum disebutkan.",
						evidence_date: date || null,
						// Backend memaksa ai_generated=false pada saat create.
						ai_generated: false,
					},
					attachmentFile,
				);
				reset();
			} catch {
				setSaveError("Gagal menyimpan bukti. Silakan coba lagi.");
			} finally {
				setSaving(false);
			}
		};

		return (
			<div className="bg-primary/5 rounded-2xl border border-primary/20 border-l-4 border-l-primary shadow-sm p-6 mb-8 relative overflow-hidden">
				<div className="flex items-center gap-2 text-primary font-bold text-sm mb-5">
					<PlusCircle size={16} />
					<span>Tambah Bukti Karier</span>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
					<div>
						<label className="text-xs font-semibold text-neutral/70 mb-2 block">
							Jenis Bukti
						</label>
						<select
							value={evidenceType}
							onChange={(e) => setEvidenceType(e.target.value)}
							className={`${inputClass} text-neutral/60`}>
							<option value="" disabled>
								Pilih jenis bukti...
							</option>
							{(Object.keys(evidenceTypeLabels) as EvidenceType[]).map(
								(type) => (
									<option key={type} value={type}>
										{evidenceTypeLabels[type]}
									</option>
								),
							)}
						</select>
					</div>

					<div>
						<label className="text-xs font-semibold text-neutral/70 mb-2 block">
							Tanggal (opsional)
						</label>
						<input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							className={`${inputClass} text-neutral/60`}
						/>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-5 mt-5">
					<div>
						<label className="text-xs font-semibold text-neutral/70 mb-2 block">
							Judul
						</label>
						<input
							ref={titleRef}
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Contoh: Meningkatkan efisiensi proses onboarding"
							className={`${inputClass} bg-white`}
						/>
					</div>

					<div>
						<label className="text-xs font-semibold text-neutral/70 mb-2 block">
							Deskripsi
						</label>
						<textarea
							rows={4}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Ceritakan apa yang kamu lakukan, tantangan, dan peranmu di dalamnya."
							className={`${inputClass} resize-none bg-white`}
						/>
					</div>

					<div>
						<label className="text-xs font-semibold text-neutral/70 mb-2 block">
							Dampak
						</label>
						<textarea
							rows={3}
							value={impact}
							onChange={(e) => setImpact(e.target.value)}
							placeholder="Contoh: Campaign menghasilkan peningkatan engagement sebesar 45%."
							className={`${inputClass} resize-none bg-white`}
						/>
					</div>

					<div>
						<label className="text-xs font-semibold text-neutral/70 mb-2 block">
							Lampiran (opsional)
						</label>
						<input
							type="file"
							accept="image/*"
							onChange={(e) =>
								setAttachmentFile(e.target.files?.[0] ?? null)
							}
							className={`${inputClass} bg-white text-xs file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary`}
						/>
						{attachmentFile && (
							<p className="text-xs text-neutral/60 mt-1.5">
								{attachmentFile.name}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center justify-end mt-5">
					<PrimaryButton
						icon={<PlusCircle size={14} />}
						disabled={!canSave || saving}
						onClick={() => void handleSave()}>
						{saving ? "Menyimpan..." : "Simpan Bukti"}
					</PrimaryButton>
				</div>
				{saveError && (
					<p className="text-xs text-red-500 font-medium text-right mt-3">
						{saveError}
					</p>
				)}
			</div>
		);
	},
);

EvidenceForm.displayName = "EvidenceForm";

export default EvidenceForm;