import { Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./context/LanguageContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import LanguageSwitcher from "./components/LanguageSwitcher.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import SendMoney from "./pages/SendMoney.jsx";
import ReceiveMoney from "./pages/ReceiveMoney.jsx";
import Transactions from "./pages/Transactions.jsx";
import Bills from "./pages/Bills.jsx";
import Help from "./pages/Help.jsx";
import Profile from "./pages/Profile.jsx";
import Contacts from "./pages/Contacts.jsx";

function LoadingScreen() {
 const { t } = useLanguage();
 return <div className="loading-screen">{t("loading")}</div>;
}

function ProtectedRoutes() {
 const { user } = useAuth();

 if (!user) return <Navigate to="/login" replace />;

 return (
 <div className="app-shell">
 <Navbar />
 <main className="page-container">
 <Routes>
 <Route path="/" element={<Home />} />
 <Route path="/send" element={<SendMoney />} />
 <Route path="/receive" element={<ReceiveMoney />} />
 <Route path="/transactions" element={<Transactions />} />
 <Route path="/bills" element={<Bills />} />
 <Route path="/help" element={<Help />} />
 <Route path="/profile" element={<Profile />} />
 <Route path="/contacts" element={<Contacts />} />
 <Route path="*" element={<Navigate to="/" replace />} />
 </Routes>
 </main>
 </div>
 );
}

function PublicRoutes() {
 const { user } = useAuth();

 if (user) return <Navigate to="/" replace />;

 return (
 <Routes>
 <Route path="/register" element={<Register />} />
 <Route path="*" element={<Login />} />
 </Routes>
 );
}

export default function App() {
 const { user, loading } = useAuth();

 return (
 <LanguageProvider>
 {loading ? <LoadingScreen /> : user ? <ProtectedRoutes /> : <PublicRoutes />}
 </LanguageProvider>
 );
}
