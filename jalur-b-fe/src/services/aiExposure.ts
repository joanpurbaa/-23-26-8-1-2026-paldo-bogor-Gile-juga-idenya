import { request } from "./http";
import type { CareerAssessmentRequest } from "../types/careerHealth";
import type { AiExposureResult } from "../types/aiExposure";

export const aiExposureApi = {
	create: (payload: CareerAssessmentRequest) =>
		request<AiExposureResult>("/api/ai-exposure", {
			method: "POST",
			body: payload,
			auth: true,
		}),

	latest: () =>
		request<AiExposureResult>("/api/ai-exposure/latest", {
			auth: true,
		}),
};