import { request } from "./http";
import type {
	CareerAssessmentRequest,
	HealthAssessmentResult,
} from "../types/careerHealth";

export const careerHealthApi = {
	create: (payload: CareerAssessmentRequest) =>
		request<HealthAssessmentResult>("/api/career-health", {
			method: "POST",
			body: payload,
			auth: true,
		}),

	latest: () =>
		request<HealthAssessmentResult>("/api/career-health/latest", {
			auth: true,
		}),
};