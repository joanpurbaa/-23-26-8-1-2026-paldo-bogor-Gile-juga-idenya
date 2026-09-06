import type { SkillRead } from "./master";

/** Option names come from the backend; these are the documented enum values. */
export type CareerGoal =
	| "grow_current"
	| "level_up"
	| "change_role"
	| "change_industry"
	| "undecided";

export type OnboardingSkill = SkillRead;

export interface OnboardingProfile {
	id: number;
	user_id: number;
	full_name: string | null;
	avatar_url: string | null;
	current_role_name: string | null;
	industry_name: string | null;
	work_duration_months: number | null;
	is_first_job: boolean | null;
	daily_activities: string | null;
	career_goal: CareerGoal | null;
	target_role_name: string | null;
	target_industry_name: string | null;
	onboarding_completed_at: string | null;
	created_at: string;
	updated_at: string;
}

export interface OnboardingResponse {
	completed: boolean;
	profile: OnboardingProfile | null;
	skills: OnboardingSkill[];
}

export interface OnboardingPayload {
	full_name: string;
	current_role_name: string;
	industry_name: string;
	work_duration_months: number;
	is_first_job: boolean;
	daily_activities: string;
	career_goal: CareerGoal;
	target_role_name: string | null;
	target_industry_name: string | null;
	skills: string[];
}

export interface OnboardingOptionsResponse {
	career_goals: CareerGoal[];
	industries: string[];
	skills: OnboardingSkill[];
}
