import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
	children: ReactNode;
	delay?: number;
	className?: string;
}

export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
	const ref = useRef<HTMLDivElement | null>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			const frameId = requestAnimationFrame(() => setVisible(true));
			return () => cancelAnimationFrame(frameId);
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={className}
			style={{
				opacity: visible ? 1 : 0,
				transform: visible ? "none" : "translateY(24px)",
				transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
			}}>
			{children}
		</div>
	);
}