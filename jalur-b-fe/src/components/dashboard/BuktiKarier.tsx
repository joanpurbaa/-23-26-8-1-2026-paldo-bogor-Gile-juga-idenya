import { useCallback, useEffect, useRef, useState } from "react";
import { PlusCircle } from "lucide-react";
import PageHeader from "../layouts/PageHeader";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import EvidenceForm from "./EvidenceForm";
import type { EvidenceFormHandle } from "./EvidenceForm";
import FilterTabs from "../ui/FilterTabs";
import EvidenceCard from "./EvidenceCard";
import Skeleton from "../ui/Skeleton";
import Modal from "../ui/Modal";
import { evidenceApi } from "../../services/evidence";
import { evidenceTypeLabels, formatEvidenceDate } from "../../lib/evidence";
import type {
	EvidenceItemCreate,
	EvidenceItemResponse,
	EvidenceItemUpdate,
	EvidenceType,
} from "../../types/evidence";

const filterOptions = ["Semua", ...Object.values(evidenceTypeLabels)];

const inputClass =
	"w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30";

function toDisplay(item: EvidenceItemResponse) {
	return {
		category: evidenceTypeLabels[item.evidence_type] ?? item.evidence_type,
		title: item.title,
		role: item.user_role || "—",
		description: item.description,
		impactLabel: "Impact",
		impactValue: item.impact || "—",
		date: formatEvidenceDate(item.evidence_date),
		aiGenerated: item.ai_generated,
		attachmentUrl: item.attachment_url,
	};
}

interface EditForm {
	evidence_type: EvidenceType | "";
	title: string;
	description: string;
	impact: string;
	evidence_date: string;
}

const emptyEditForm: EditForm = {
	evidence_type: "",
	title: "",
	description: "",
	impact: "",
	evidence_date: "",
};

export default function BuktiKarier() {
	const [activeFilter, setActiveFilter] = useState("Semua");
	const [items, setItems] = useState<EvidenceItemResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false);
	const formRef = useRef<EvidenceFormHandle>(null);

	const [editing, setEditing] = useState<EvidenceItemResponse | null>(null);
	const [editForm, setEditForm] = useState<EditForm>(emptyEditForm);
	const [editFile, setEditFile] = useState<File | null>(null);
	const [removeAttachment, setRemoveAttachment] = useState(false);
	const [editSaving, setEditSaving] = useState(false);
	const [editError, setEditError] = useState("");

	useEffect(() => {
		let active = true;
		evidenceApi
			.list({ limit: 100 })
			.then((res) => {
				if (active) setItems(res.items);
			})
			.catch(() => {
				if (active) setLoadError(true);
			})
			.finally(() => {
				if (active) setLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleCreate = useCallback(
		async (payload: EvidenceItemCreate, file?: File | null) => {
			let created = await evidenceApi.create(payload);
			if (file) {
				try {
					created = await evidenceApi.uploadAttachment(created.id, file);
				} catch {
					// Upload lampiran gagal — bukti tetap tersimpan tanpa lampiran.
				}
			}
			setItems((prev) => [created, ...prev]);
			setActiveFilter("Semua");
		},
		[],
	);

	const openEdit = (item: EvidenceItemResponse) => {
		setEditForm({
			evidence_type: item.evidence_type,
			title: item.title,
			description: item.description,
			impact: item.impact || "",
			evidence_date: item.evidence_date || "",
		});
		setEditFile(null);
		setRemoveAttachment(false);
		setEditError("");
		setEditing(item);
	};

	const closeEdit = () => {
		setEditing(null);
		setEditForm(emptyEditForm);
		setEditFile(null);
		setRemoveAttachment(false);
		setEditError("");
	};

	const updateEditField = <K extends keyof EditForm>(
		key: K,
		value: EditForm[K],
	) => setEditForm((prev) => ({ ...prev, [key]: value }));

	const handleEditSave = async () => {
		if (!editing || editSaving) return;
		setEditSaving(true);
		setEditError("");
		try {
			const payload: EvidenceItemUpdate = {};
			if (editForm.evidence_type)
				payload.evidence_type = editForm.evidence_type;
			if (editForm.title.trim()) payload.title = editForm.title.trim();
			if (editForm.description.trim())
				payload.description = editForm.description.trim();
			if (editForm.impact.trim()) payload.impact = editForm.impact.trim();
			if (editForm.evidence_date)
				payload.evidence_date = editForm.evidence_date;

			let updated = await evidenceApi.update(editing.id, payload);
			if (editFile) {
				try {
					updated = await evidenceApi.uploadAttachment(editing.id, editFile);
				} catch {
					// Gagal mengunggah lampiran baru — field bukti tetap tersimpan.
				}
			} else if (removeAttachment) {
				try {
					await evidenceApi.deleteAttachment(editing.id);
					updated = { ...updated, attachment_url: null };
				} catch {
					// Gagal menghapus lampiran — field bukti tetap tersimpan.
				}
			}
			setItems((prev) =>
				prev.map((item) => (item.id === updated.id ? updated : item)),
			);
			closeEdit();
		} catch {
			setEditError("Gagal menyimpan bukti. Silakan coba lagi.");
		} finally {
			setEditSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!editing || editSaving) return;
		setEditSaving(true);
		setEditError("");
		try {
			await evidenceApi.remove(editing.id);
			setItems((prev) => prev.filter((item) => item.id !== editing.id));
			closeEdit();
		} catch {
			setEditError("Gagal menghapus bukti. Silakan coba lagi.");
		} finally {
			setEditSaving(false);
		}
	};

	const filteredItems = items.filter(
		(item) =>
			activeFilter === "Semua" ||
			(evidenceTypeLabels[item.evidence_type] ?? item.evidence_type) ===
				activeFilter,
	);

	return (
		<div>
			<PageHeader
				title="Bukti Karier"
				subtitle="Simpan pencapaianmu sekarang. Jangan tunggu sampai kamu membutuhkannya."
			/>

			<EvidenceForm ref={formRef} onSave={handleCreate} />

			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-6">
							<Skeleton className="h-4 w-20 rounded-lg mb-4" />
							<Skeleton className="h-5 w-2/3 mb-2" />
							<Skeleton className="h-3 w-28 mb-6" />
							<Skeleton className="h-3 w-full mb-2" />
							<Skeleton className="h-3 w-4/5 mb-6" />
							<Skeleton className="h-12 w-full rounded-xl mb-4" />
							<Skeleton className="h-3 w-24" />
						</div>
					))}
				</div>
			) : items.length === 0 ? (
				loadError ? (
					<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-10 text-center">
						<h3 className="text-lg font-bold text-neutral">
							Gagal memuat bukti karier
						</h3>
						<p className="text-sm text-neutral/60 mt-2 max-w-md mx-auto leading-relaxed">
							Kami tidak dapat mengambil data bukti kariermu. Periksa koneksi
							dan coba lagi.
						</p>
					</div>
				) : (
					<div className="bg-white rounded-2xl border border-neutral/5 shadow-sm p-10 text-center">
						<h3 className="text-lg font-bold text-neutral">
							Belum ada bukti karier
						</h3>
						<p className="text-sm text-neutral/60 mt-2 max-w-md mx-auto leading-relaxed">
							Mulai simpan project, pencapaian, atau pengalaman pentingmu
							sekarang. Nanti kamu akan berterima kasih saat membutuhkannya.
						</p>
						<div className="mt-5 flex justify-center">
							<PrimaryButton
								icon={<PlusCircle size={14} />}
								onClick={() => formRef.current?.open()}>
								Tambah Bukti
							</PrimaryButton>
						</div>
					</div>
				)
			) : (
				<>
					<FilterTabs
						options={filterOptions}
						active={activeFilter}
						onChange={setActiveFilter}
					/>

					{filteredItems.length === 0 ? (
						<p className="text-sm text-neutral/50">
							Tidak ada bukti pada kategori ini.
						</p>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
							{filteredItems.map((item) => (
								<EvidenceCard
									key={item.id}
									{...toDisplay(item)}
									onEdit={() => openEdit(item)}
									onDelete={() => openEdit(item)}
								/>
							))}
						</div>
					)}
				</>
			)}

			<Modal
				open={editing !== null}
				onClose={closeEdit}
				title="Edit Bukti Karier">
				<div className="space-y-4">
					<div>
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Jenis Bukti
						</label>
						<select
							value={editForm.evidence_type}
							onChange={(e) =>
								updateEditField(
									"evidence_type",
									e.target.value as EvidenceType,
								)
							}
							className={inputClass}>
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
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Judul
						</label>
						<input
							type="text"
							value={editForm.title}
							onChange={(e) => updateEditField("title", e.target.value)}
							className={inputClass}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Deskripsi
						</label>
						<textarea
							rows={3}
							value={editForm.description}
							onChange={(e) => updateEditField("description", e.target.value)}
							className={`${inputClass} resize-none`}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Dampak
						</label>
						<textarea
							rows={2}
							value={editForm.impact}
							onChange={(e) => updateEditField("impact", e.target.value)}
							className={`${inputClass} resize-none`}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Tanggal
						</label>
						<input
							type="date"
							value={editForm.evidence_date}
							onChange={(e) =>
								updateEditField("evidence_date", e.target.value)
							}
							className={inputClass}
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
							Lampiran
						</label>
						{editing?.attachment_url && !removeAttachment ? (
							<div className="flex items-center gap-3 rounded-xl border border-neutral/10 bg-neutral/5 p-2.5 mb-2">
								<img
									src={editing.attachment_url}
									alt="Lampiran bukti"
									className="h-12 w-12 rounded-lg object-cover border border-neutral/10"
								/>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-neutral/60 truncate">
										{editing.attachment_url}
									</p>
									<button
										type="button"
										onClick={() => setRemoveAttachment(true)}
										className="text-xs font-medium text-red-500 hover:text-red-600 transition cursor-pointer mt-1">
										Hapus Lampiran
									</button>
								</div>
							</div>
						) : null}
						{removeAttachment && (
							<p className="text-xs text-neutral/50 mb-2">
								Lampiran saat ini akan dihapus.{" "}
								<button
									type="button"
									onClick={() => setRemoveAttachment(false)}
									className="text-primary font-semibold cursor-pointer">
									Batalkan
								</button>
							</p>
						)}
						<input
							type="file"
							accept="image/*"
							onChange={(e) => {
								setEditFile(e.target.files?.[0] ?? null);
								if (e.target.files?.[0]) setRemoveAttachment(false);
							}}
							className={`${inputClass} file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary`}
						/>
						{editFile && (
							<p className="text-xs text-neutral/50 mt-1.5">
								{editFile.name}
							</p>
						)}
					</div>
					{editError && (
						<p className="text-xs text-red-500 font-medium">{editError}</p>
					)}
				</div>
				<div className="flex justify-between gap-2.5 mt-2">
					<button
						type="button"
						onClick={() => void handleDelete()}
						disabled={editSaving}
						className="text-xs font-medium text-red-500 hover:text-red-600 transition cursor-pointer disabled:opacity-50">
						Hapus Bukti
					</button>
					<div className="flex items-center gap-2.5">
						<SecondaryButton onClick={closeEdit}>Batal</SecondaryButton>
						<PrimaryButton
							onClick={() => void handleEditSave()}
							disabled={editSaving}>
							{editSaving ? "Menyimpan..." : "Simpan Perubahan"}
						</PrimaryButton>
					</div>
				</div>
			</Modal>
		</div>
	);
}