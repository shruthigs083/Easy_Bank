import { useEffect, useState } from "react";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import api from "../services/api.js";
import TransactionItem from "../components/TransactionItem.jsx";

export default function Transactions() {
 const { t } = useLanguage();
 const [transactions, setTransactions] = useState([]);
 const [error, setError] = useState("");

 useEffect(() => {
 api.get("/transactions")
 .then(({ data }) => setTransactions(data.transactions))
 .catch(() => setError(t("couldNotLoad")));
 }, []);

 return (
 <div className="wide-page">
 <Link to="/" className="back-link"><ArrowLeft size={20} /> {t("backHome")}</Link>
 <div className="page-title-row">
 <div><p className="eyebrow">{t("moneyActivity")}</p><h1>{t("transactions")}</h1></div>
 <div className="page-icon"><FileText size={28} /></div>
 </div>
 {error && <div className="form-message error">{error}</div>}
 <div className="transaction-list large">
 {transactions.length ? transactions.map((tx) => <TransactionItem key={tx._id} transaction={tx} />)
 : <div className="empty-card">{t("noTransactionsShort")}</div>}
 </div>
 </div>
 );
}
