export interface UserResponse {
	id: number;
	username: string;
	email: string;
	email_verified: boolean;
}

export interface AuthTokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
	next_path: string;
	user: UserResponse;
}

export interface GoogleCodeExchange {
	code: string;
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface LoginRequest {
	email: string;
	password: string;
}
