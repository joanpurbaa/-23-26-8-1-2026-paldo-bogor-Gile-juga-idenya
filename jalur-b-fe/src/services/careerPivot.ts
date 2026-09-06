import { request } from "./http";
import type { CareerAssessmentRequest } from "../types/careerHealth";
import type { CareerPivotResult } from "../types/careerPivot";

export const careerPivotApi = {
	create: (payload: CareerAssessmentRequest) =>
		request<CareerPivotResult>("/api/career-pivot", {
			method: "POST",
			body: payload,
			auth: true,
		}),

	latest: () =>
		request<CareerPivotResult>("/api/career-pivot/latest", {
			auth: true,
		}),
};