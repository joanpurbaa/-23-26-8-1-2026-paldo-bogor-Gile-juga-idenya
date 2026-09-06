import { useState } from "react";
import Modal from "../ui/Modal";
import { PrimaryButton, SecondaryButton } from "../ui/PrimaryButton";
import { profileApi } from "../../services/profile";
import { ApiError } from "../../types/api";
import type { OnboardingProfile } from "../../types/onboarding";
import type { UserResponse } from "../../types/auth";

interface EditProfileModalProps {
	open: boolean;
	onClose: () => void;
	onSaved: (profile: OnboardingProfile) => void;
	profile?: OnboardingProfile | null;
	user?: UserResponse | null;
}

export function EditProfileModal({
	open,
	onClose,
	onSaved,
	profile,
	user,
}: EditProfileModalProps) {
	const [fullName, setFullName] = useState(
		profile?.full_name || user?.username || "",
	);
	const [role, setRole] = useState(profile?.current_role_name || "");
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");

	const handleSave = async () => {
		setSaving(true);
		setError("");
		try {
			const res = await profileApi.update({
				full_name: fullName.trim() || null,
				current_role_name: role.trim() || null,
			});
			onSaved(res.profile);
			onClose();
		} catch (err) {
			setError(
				err instanceof ApiError
					? err.message
					: "Gagal menyimpan profil. Silakan coba lagi.",
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Modal open={open} onClose={onClose} title="Edit Profil">
			<div className="space-y-4">
				<div>
					<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
						Nama
					</label>
					<input
						type="text"
						value={fullName}
						onChange={(e) => setFullName(e.target.value)}
						className="w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
				<div>
					<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
						Role / Jabatan
					</label>
					<input
						type="text"
						value={role}
						onChange={(e) => setRole(e.target.value)}
						className="w-full text-sm text-neutral bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
					/>
				</div>
				<div>
					<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
						Email
					</label>
					<input
						type="text"
						value={user?.email || ""}
						disabled
						className="w-full text-sm text-neutral/50 bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5"
					/>
				</div>
				<div>
					<label className="text-xs font-semibold text-neutral/60 mb-1.5 block">
						Username
					</label>
					<input
						type="text"
						value={user?.username || ""}
						disabled
						className="w-full text-sm text-neutral/50 bg-neutral/5 border border-neutral/10 rounded-xl px-4 py-2.5"
					/>
				</div>
				{error && <p className="text-xs text-red-500 font-medium">{error}</p>}
			</div>
			<div className="flex justify-end gap-2.5 mt-2">
				<SecondaryButton onClick={onClose}>Batal</SecondaryButton>
				<PrimaryButton onClick={handleSave} disabled={saving}>
					{saving ? "Menyimpan..." : "Simpan"}
				</PrimaryButton>
			</div>
		</Modal>
	);
}
