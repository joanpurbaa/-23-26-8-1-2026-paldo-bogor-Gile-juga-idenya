import { request } from "./http";
import type { DashboardResponse } from "../types/dashboard";

export const dashboardApi = {
	get: () => request<DashboardResponse>("/api/dashboard", { auth: true }),
};