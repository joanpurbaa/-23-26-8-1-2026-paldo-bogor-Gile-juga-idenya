import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../layouts/PageHeader";
import ProfileHeaderCard from "../profile/ProfileHeaderCard";
import CareerSummaryCard from "../profile/CareerSummaryCard";
import ProfileSection from "../profile/ProfileSection";
import CareerInfoCard from "../profile/CareerInfoCard";
import RiskSummaryCard from "../profile/RiskSummaryCard";
import SkillSummaryCard from "../profile/SkillSummaryCard";
import CareerPathSummaryCard from "../profile/CareerPathSummaryCard";
import EvidenceSummaryCard from "../profile/EvidenceSummaryCard";
import FinancialSummaryCard from "../profile/FinancialSummaryCard";
import SimulationSummaryCard from "../profile/SimulationSummaryCard";
import CareerExperienceCard from "../profile/CareerExperienceCard";
import { EditProfileModal } from "../profile/EditProfileModal";
import { EditCareerModal } from "../profile/EditCareerModal";
import { profileApi } from "../../services/profile";
import type { OnboardingProfile } from "../../types/onboarding";
import type { OnboardingSkill } from "../../types/onboarding";
import { useAuth } from "../../context/AuthContext";

export default function Profil() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [profile, setProfile] = useState<OnboardingProfile | null>(null);
	const [skills, setSkills] = useState<OnboardingSkill[]>([]);
	const [profileLoading, setProfileLoading] = useState(true);
	const [editProfileOpen, setEditProfileOpen] = useState(false);
	const [editCareerOpen, setEditCareerOpen] = useState(false);

	useEffect(() => {
		let active = true;
		profileApi
			.get()
			.then((res) => {
				if (active) {
					setProfile(res.profile);
					setSkills(res.skills ?? []);
				}
			})
			.catch(() => {
				// profil belum tersedia (mis. onboarding belum selesai) — biarkan null
			})
			.finally(() => {
				if (active) setProfileLoading(false);
			});
		return () => {
			active = false;
		};
	}, []);

	const handleProfileSaved = (p: OnboardingProfile) => setProfile(p);
	const handleCareerSaved = (p: OnboardingProfile) => setProfile(p);

	return (
		<div>
			<PageHeader
				title="Profil"
				subtitle="Kelola informasi diri dan data yang digunakan Jalur B untuk memahami kondisi kariermu."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-stretch">
				<ProfileHeaderCard
					profile={profile}
					user={user}
					loading={profileLoading}
					onEdit={() => setEditProfileOpen(true)}
				/>
				<div className="lg:col-span-2">
					<ProfileSection title="Ringkasan Karier">
						<CareerSummaryCard />
					</ProfileSection>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<ProfileSection title="Informasi Karier">
					<CareerInfoCard
						profile={profile}
						loading={profileLoading}
						onEdit={() => setEditCareerOpen(true)}
					/>
				</ProfileSection>

				<ProfileSection title="Profil Risiko Karier">
					<RiskSummaryCard onSeeMore={() => navigate("/dashboard/risiko-karier")} />
				</ProfileSection>

				<ProfileSection title="Skill & AI">
					<SkillSummaryCard onSeeMore={() => navigate("/dashboard/skill")} />
				</ProfileSection>

				<div className="lg:col-span-2">
					<ProfileSection
						title="Pengalaman Karier & Skill"
						description="Riwayat pekerjaan, skill, dan berkas CV yang melengkapi profil kariermu.">
						<CareerExperienceCard
							skills={skills}
							loading={profileLoading}
						/>
					</ProfileSection>
				</div>

				<ProfileSection title="Jalur Karier">
					<CareerPathSummaryCard onSeeMore={() => navigate("/dashboard/jalur-karier")} />
				</ProfileSection>

				<ProfileSection title="Bukti Karier">
					<EvidenceSummaryCard onSeeMore={() => navigate("/dashboard/bukti-karier")} />
				</ProfileSection>

				<ProfileSection title="Informasi Finansial">
					<FinancialSummaryCard />
				</ProfileSection>

				<div className="lg:col-span-2">
					<ProfileSection title="Data Simulasi">
						<SimulationSummaryCard
							onSeeMore={() => navigate("/dashboard/simulasi")}
						/>
					</ProfileSection>
				</div>
			</div>

			<EditProfileModal
				key={`edit-profile:${editProfileOpen}`}
				open={editProfileOpen}
				onClose={() => setEditProfileOpen(false)}
				profile={profile}
				user={user}
				onSaved={handleProfileSaved}
			/>
			<EditCareerModal
				key={`edit-career:${editCareerOpen}`}
				open={editCareerOpen}
				onClose={() => setEditCareerOpen(false)}
				profile={profile}
				onSaved={handleCareerSaved}
			/>
		</div>
	);
}
