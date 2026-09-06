import {
	createContext,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from "react";
import CareerAssessmentModal from "../components/dashboard/CareerAssessmentModal";

interface CareerAssessmentContextValue {
	openCareerAssessment: () => void;
	refreshKey: number;
}

const CareerAssessmentContext =
	createContext<CareerAssessmentContextValue | null>(null);

export function CareerAssessmentProvider({ children }: { children: ReactNode }) {
	const [isOpen, setIsOpen] = useState(false);
	const [openCount, setOpenCount] = useState(0);
	const [refreshKey, setRefreshKey] = useState(0);

	const openCareerAssessment = useCallback(() => {
		setOpenCount((c) => c + 1);
		setIsOpen(true);
	}, []);

	const handleSaved = useCallback(() => {
		setRefreshKey((k) => k + 1);
		setIsOpen(false);
	}, []);

	return (
		<CareerAssessmentContext.Provider
			value={{ openCareerAssessment, refreshKey }}>
			{children}
			<CareerAssessmentModal
				key={openCount}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onSaved={handleSaved}
			/>
		</CareerAssessmentContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCareerAssessment(): CareerAssessmentContextValue {
	const ctx = useContext(CareerAssessmentContext);
	if (!ctx) {
		throw new Error(
			"useCareerAssessment harus dipakai di dalam CareerAssessmentProvider",
		);
	}
	return ctx;
}