import { request } from "./http";
import type {
	LayoffScenario,
	LayoffSimulationResult,
} from "../types/layoffSimulation";

export const layoffSimulationApi = {
	create: (scenario: LayoffScenario) =>
		request<LayoffSimulationResult>("/api/layoff-simulations", {
			method: "POST",
			body: { scenario },
			auth: true,
		}),

	latest: () =>
		request<LayoffSimulationResult>("/api/layoff-simulations/latest", {
			auth: true,
		}),

	get: (simulationId: number) =>
		request<LayoffSimulationResult>(`/api/layoff-simulations/${simulationId}`, {
			auth: true,
		}),
};