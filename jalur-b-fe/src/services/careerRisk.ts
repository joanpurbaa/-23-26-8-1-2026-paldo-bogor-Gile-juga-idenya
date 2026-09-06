import { request } from "./http";
import type { CareerAssessmentRequest } from "../types/careerHealth";
import type { CareerRiskResult } from "../types/careerRisk";

export const careerRiskApi = {
	create: (payload: CareerAssessmentRequest) =>
		request<CareerRiskResult>("/api/career-risk", {
			method: "POST",
			body: payload,
			auth: true,
		}),

	latest: () =>
		request<CareerRiskResult>("/api/career-risk/latest", {
			auth: true,
		}),
};