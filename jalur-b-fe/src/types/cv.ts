export interface CvExperience {
	role: string;
	company: string;
	start_date: string;
	end_date: string;
	description: string;
}

export interface CvProfile {
	full_name: string;
	current_role_name: string;
	industry_name: string;
	work_duration_months: number;
	daily_activities: string;
}

export interface CvGetResponse {
	uploaded_at: string;
	experiences: CvExperience[];
	model: string;
}

export interface CvPreviewResponse {
	preview_id: string;
	preview_token: string;
	file_name: string;
	file_size: number;
	content_type: string;
	expires_at: string;
	profile: CvProfile;
	skills: string[];
	experiences: CvExperience[];
	model: string;
}

export interface CvConfirmPayload {
	preview_token: string;
	profile: CvProfile;
	skills: string[];
	experiences: CvExperience[];
}

export interface CvConfirmResponse {
	cv: {
		uploaded_at: string;
		experiences: CvExperience[];
		model: string;
	};
	profile: {
		id: number;
		user_id: number;
		full_name: string;
		avatar_url: string | null;
		current_role_name: string;
		industry_name: string;
		work_duration_months: number;
		is_first_job: boolean;
		daily_activities: string;
		career_goal: string;
		target_role_name: string | null;
		target_industry_name: string | null;
		onboarding_completed_at: string | null;
		created_at: string;
		updated_at: string;
	};
	skills: Array<{
		id: number;
		name: string;
		category: string | null;
		market_trend: string;
	}>;
}
