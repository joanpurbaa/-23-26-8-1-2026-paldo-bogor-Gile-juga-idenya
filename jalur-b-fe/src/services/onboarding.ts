import { request } from "./http";
import type {
	OnboardingResponse,
	OnboardingPayload,
	OnboardingOptionsResponse,
} from "../types/onboarding";

export const onboardingApi = {
	get: () => request<OnboardingResponse>("/api/onboarding", { auth: true }),

	complete: (payload: OnboardingPayload) =>
		request<OnboardingResponse>("/api/onboarding", {
			method: "PUT",
			body: payload,
			auth: true,
		}),

	options: () =>
		request<OnboardingOptionsResponse>("/api/onboarding/options", {
			auth: true,
		}),
};
