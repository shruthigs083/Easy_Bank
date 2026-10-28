import { ArrowLeft, ChevronDown, CircleHelp } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext.jsx";

export default function Help() {
 const { t } = useLanguage();
 const [open, setOpen] = useState(null);
 const topics = [
 ["faqBalanceQ", "faqBalanceA"], ["faqSendQ", "faqSendA"], ["faqReceiveQ", "faqReceiveA"],
 ["faqTransactionsQ", "faqTransactionsA"], ["faqRealQ", "faqRealA"], ["faqMistakeQ", "faqMistakeA"]
 ];

 return (
 <div className="wide-page">
 <Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 <div className="page-title-row">
 <div><p className="eyebrow">{t("easyAnswers")}</p><h1>{t("howHelp")}</h1></div>
 <div className="page-icon"><CircleHelp size={28} /></div>
 </div>
 <div className="help-list">
 {topics.map(([q, a], index) => (
 <div className="faq-card" key={q}>
 <button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>
 <span>{t(q)}</span><ChevronDown className={open === index ? "rotate" : ""} />
 </button>
 {open === index && <div className="faq-answer">{t(a)}</div>}
 </div>
 ))}
 </div>
 </div>
 );
}
