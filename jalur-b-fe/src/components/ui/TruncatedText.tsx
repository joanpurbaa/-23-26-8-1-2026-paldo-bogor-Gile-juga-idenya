import { useEffect, useRef, useState } from "react";

type TruncatedTag = "span" | "p" | "h2" | "h3" | "h4";

interface TruncatedTextProps {
	text: string;
	as?: TruncatedTag;
	className?: string;
	wrapperClassName?: string;
}

// Teks dipotong dengan "..." bila melewati batas, dan saat di-hover
// muncul tooltip kecil berisi teks lengkap (hanya bila benar-benar terpotong).
export default function TruncatedText({
	text,
	as: Tag = "span",
	className = "",
	wrapperClassName = "",
}: TruncatedTextProps) {
	const ref = useRef<HTMLElement | null>(null);
	const [truncated, setTruncated] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const update = () => setTruncated(el.scrollWidth > el.clientWidth);
		update();
		const ro = new ResizeObserver(update);
		ro.observe(el);
		return () => ro.disconnect();
	}, [text]);

	return (
		<span
			className={`relative inline-block max-w-full ${
				truncated ? "group" : ""
			} ${wrapperClassName}`}>
			<Tag
				ref={(el: HTMLElement | null) => {
					ref.current = el;
				}}
				className={`block max-w-full overflow-hidden text-ellipsis whitespace-nowrap ${className}`}>
				{text}
			</Tag>
			{truncated && (
				<span className="pointer-events-none absolute left-1/2 top-full z-30 mt-1.5 hidden -translate-x-1/2 max-w-xs whitespace-normal break-words rounded-lg border border-neutral/10 bg-white px-3 py-1.5 text-left text-xs font-normal text-neutral shadow-xl group-hover:block">
					{text}
				</span>
			)}
		</span>
	);
}