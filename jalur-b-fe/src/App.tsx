import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import BerandaView from "./components/dashboard/BerandaView";
import KesehatanKarier from "./components/dashboard/KesehatanKarier";
import JalurKarier from "./components/dashboard/JalurKarier";
import Login from "./pages/Login";
import Register from "./pages/Register";
import GoogleCallback from "./pages/GoogleCallback";
import RequireAuth from "./components/auth/RequireAuth";
import GuestOnly from "./components/auth/GuestOnly";
import OnboardingRoute from "./components/auth/OnboardingRoute";
import { AuthProvider } from "./context/AuthContext";
import RisikoKarier from "./components/dashboard/RisikoKarier";
import BuktiKarier from "./components/dashboard/BuktiKarier";
import Finansial from "./components/dashboard/Finansial";
import Skill from "./components/dashboard/Skill";
import Simulasi from "./components/dashboard/Simulasi";
import Profil from "./components/dashboard/Profil";
import Home from "./pages/Home";

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route
						path="/login"
						element={
							<GuestOnly>
								<Login />
							</GuestOnly>
						}
					/>
					<Route
						path="/register"
						element={
							<GuestOnly>
								<Register />
							</GuestOnly>
						}
					/>
					<Route path="/auth/callback" element={<GoogleCallback />} />
					<Route
						path="/onboarding"
						element={
							<OnboardingRoute>
								<Onboarding />
							</OnboardingRoute>
						}
					/>

					<Route
						path="/dashboard"
						element={
							<RequireAuth>
								<Dashboard />
							</RequireAuth>
						}>
						<Route index element={<Navigate to="beranda" replace />} />
						<Route path="beranda" element={<BerandaView />} />
						<Route path="kesehatan-karier" element={<KesehatanKarier />} />
						<Route path="risiko-karier" element={<RisikoKarier />} />
						<Route path="skill" element={<Skill />} />
						<Route path="jalur-karier" element={<JalurKarier />} />
						<Route path="bukti-karier" element={<BuktiKarier />} />
						<Route path="finansial" element={<Finansial />} />
						<Route path="simulasi" element={<Simulasi />} />
						<Route path="profil" element={<Profil />} />
					</Route>
				</Routes>
			</AuthProvider>
		</Router>
	);
}
