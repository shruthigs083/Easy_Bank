import { Languages } from "lucide-react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function LanguageSwitcher({ compact = false }) {
 const { language, changeLanguage, t } = useLanguage();

 return (
 <label className={`language-control ${compact ? "compact" : ""}`}>
 <Languages size={18} aria-hidden="true" />
 <span className="sr-only">{t("language")}</span>
 <select
 value={language}
 onChange={(e) => changeLanguage(e.target.value)}
 aria-label={t("language")}
 >
 <option value="en">{t("english")}</option>
 <option value="kn">{t("kannada")}</option>
 <option value="hi">{t("hindi")}</option>
 </select>
 </label>
 );
}
