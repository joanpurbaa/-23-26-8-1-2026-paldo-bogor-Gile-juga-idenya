import FinalVideoBanner from "../components/home/FinalVideoBanner";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import Navbar from "../components/home/Navbar";
import PreparedVideoBanner from "../components/home/PreparedVideoBanner";
import RoleTicker from "../components/home/RoleTicker";
import SolutionSection from "../components/home/SolutionSection";
import VideoBanner from "../components/home/VideoBanner";

export default function Home() {
	return (
		<div className="font-system-ui overflow-x-hidden">
			<Navbar />
			<Hero />
			<RoleTicker />
			<VideoBanner />
			<SolutionSection />
			<PreparedVideoBanner />
			<HowItWorks />
			<FinalVideoBanner />
		</div>
	);
}
