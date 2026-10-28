import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, HelpCircle, LogOut, UserCircle, ContactRound } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import LanguageSwitcher from "./LanguageSwitcher.jsx";

export default function Navbar() {
 const { user, logout } = useAuth();
 const { t } = useLanguage();
 const navigate = useNavigate();

 function handleLogout() {
 logout();
 navigate("/login");
 }

 return (
 <header className="topbar">
 <div className="topbar-inner">
 <Link to="/" className="brand" aria-label={t("easyBankHome")}>
 <span className="brand-mark">E</span>
 <span>EasyBank</span>
 </Link>

 <div className="nav-right">
 <LanguageSwitcher />
 <NavLink to="/profile" className="profile-link">
 <UserCircle size={23} />
 <span>{user?.name?.split(" ")[0]}</span>
 </NavLink>
 <button className="icon-button" onClick={handleLogout} title={t("logout")} aria-label={t("logout")}>
 <LogOut size={22} />
 </button>
 </div>
 </div>

 <nav className="mobile-nav" aria-label={t("home")}>
 <NavLink to="/"><Home size={22} /><span>{t("home")}</span></NavLink>
 <NavLink to="/transactions"><span className="nav-symbol">₹</span><span>{t("transactions")}</span></NavLink>
 <NavLink to="/contacts"><ContactRound size={22} /><span>{t("contacts")}</span></NavLink>
 <NavLink to="/help"><HelpCircle size={22} /><span>{t("help")}</span></NavLink>
 </nav>
 </header>
 );
}
