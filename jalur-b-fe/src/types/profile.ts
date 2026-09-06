import type { UserResponse } from "./auth";
import type { OnboardingProfile, OnboardingSkill } from "./onboarding";

export type UserProfileResponse = OnboardingProfile;

export interface ProfileResponse {
	user: UserResponse;
	profile: UserProfileResponse;
	skills: OnboardingSkill[];
}

export type UserProfileUpdate = Partial<{
	full_name: string | null;
	current_role_name: string | null;
	industry_name: string | null;
	work_duration_months: number | null;
	is_first_job: boolean | null;
	daily_activities: string | null;
	career_goal: OnboardingProfile["career_goal"];
	target_role_name: string | null;
	target_industry_name: string | null;
	avatar_url: string | null;
}>;
