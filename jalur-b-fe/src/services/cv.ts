import { request } from "./http";
import type {
	CvGetResponse,
	CvPreviewResponse,
	CvConfirmPayload,
	CvConfirmResponse,
} from "../types/cv";

export const cvApi = {
	get: () => request<CvGetResponse>("/api/profile/cv", { auth: true }),

	preview: (file: File) => {
		const form = new FormData();
		form.append("file", file);
		return request<CvPreviewResponse>("/api/profile/cv/preview", {
			method: "POST",
			body: form,
			auth: true,
		});
	},

	confirm: (payload: CvConfirmPayload) =>
		request<CvConfirmResponse>("/api/profile/cv/confirm", {
			method: "POST",
			body: payload,
			auth: true,
		}),
};
