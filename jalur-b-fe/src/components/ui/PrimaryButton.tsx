import type { ReactNode } from "react";

interface ButtonProps {
	children: ReactNode;
	icon?: ReactNode;
	onClick?: () => void;
	fullWidth?: boolean;
	disabled?: boolean;
}

export function PrimaryButton({
	children,
	icon,
	onClick,
	fullWidth,
	disabled,
}: ButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`${fullWidth ? "w-full" : ""} py-2.5 px-4 bg-primary text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm ${
				disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
			}`}>
			{icon}
			{children}
		</button>
	);
}

export function SecondaryButton({
	children,
	icon,
	onClick,
	fullWidth,
}: ButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`${fullWidth ? "w-full" : ""} py-2.5 px-4 border border-primary/30 text-primary bg-white text-xs font-semibold rounded-xl hover:bg-primary/5 transition flex items-center justify-center gap-2`}>
			{icon}
			{children}
		</button>
	);
}
