import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface ExpandableTextProps {
	text: string;
	className?: string;
	buttonClassName?: string;
	maxLines?: number;
}

export default function ExpandableText({
	text,
	className = "",
	buttonClassName = "",
	maxLines = 3,
}: ExpandableTextProps) {
	const ref = useRef<HTMLParagraphElement>(null);
	const [expanded, setExpanded] = useState(false);
	const [overflowing, setOverflowing] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el || !text) {
			setOverflowing(false);
			return;
		}

		const measure = () => {
			const parent = el.parentElement;
			if (!parent) return;

			const clone = el.cloneNode(true) as HTMLParagraphElement;
			clone.style.display = "block";
			clone.style.removeProperty("-webkit-line-clamp");
			clone.style.overflow = "visible";
			clone.style.position = "absolute";
			clone.style.visibility = "hidden";
			clone.style.pointerEvents = "none";
			clone.style.left = "-9999px";
			clone.style.width = `${el.clientWidth}px`;
			parent.appendChild(clone);

			const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 0;
			const natural = clone.offsetHeight;

			clone.remove();

			if (lineHeight > 0) {
				// hanya anggap meluap bila jelas melebihi area yang di-klamp.
				setOverflowing(natural > maxLines * lineHeight + lineHeight * 0.2);
			}
		};

		let cancelled = false;
		measure();
		document.fonts?.ready.then(() => {
			if (!cancelled) measure();
		});
		const ro = new ResizeObserver(measure);
		ro.observe(el);
		return () => {
			cancelled = true;
			ro.disconnect();
		};
	}, [text, maxLines]);

	if (!text.trim()) return null;

	return (
		<div className={className}>
			<p
				ref={ref}
				style={
					expanded
						? undefined
						: {
								display: "-webkit-box",
								WebkitBoxOrient: "vertical",
								WebkitLineClamp: maxLines,
								overflow: "hidden",
							}
				}>
				{text.trim()}
			</p>
			{overflowing && (
				<button
					type="button"
					onClick={() => setExpanded((v) => !v)}
					className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-80 transition cursor-pointer ${buttonClassName}`}>
					{expanded ? "Sembunyikan" : "Lihat selengkapnya"}
					<ChevronDown
						size={13}
						className={`transition-transform ${expanded ? "rotate-180" : ""}`}
					/>
				</button>
			)}
		</div>
	);
}