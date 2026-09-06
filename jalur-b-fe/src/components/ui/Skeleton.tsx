interface SkeletonProps {
	className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
	return <div className={`animate-pulse bg-neutral/10 rounded-lg ${className}`} />;
}

export function SkeletonText({
	width = "100%",
	className = "",
}: { width?: string; className?: string }) {
	return <Skeleton className={`h-3.5 ${width} ${className}`} />;
}

export function SkeletonCircle({ size = "w-9 h-9" }: { size?: string }) {
	return <Skeleton className={`${size} rounded-full`} />;
}

export function SkeletonButton({ className = "" }: SkeletonProps) {
	return <Skeleton className={`h-10 w-36 rounded-full ${className}`} />;
}