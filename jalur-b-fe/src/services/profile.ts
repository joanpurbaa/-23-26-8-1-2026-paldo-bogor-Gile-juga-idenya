import { request } from "./http";
import type { ProfileResponse, UserProfileUpdate } from "../types/profile";

export const profileApi = {
	get: () => request<ProfileResponse>("/api/profile", { auth: true }),

	update: (payload: UserProfileUpdate) =>
		request<ProfileResponse>("/api/profile", {
			method: "PATCH",
			body: payload,
			auth: true,
		}),
};
