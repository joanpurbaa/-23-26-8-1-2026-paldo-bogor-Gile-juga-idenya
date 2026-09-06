export class ApiError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

export interface MessageResponse {
	message: string;
}

/** Paginated list response used by master-data endpoints. */
export interface Page<T> {
	items: T[];
	total: number;
	limit: number;
	offset: number;
}
