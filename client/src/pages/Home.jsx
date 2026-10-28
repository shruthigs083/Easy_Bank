import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, FileText, HelpCircle, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useLanguage } from "../context/LanguageContext.jsx";
import api from "../services/api.js";
import ActionCard from "../components/ActionCard.jsx";
import TransactionItem from "../components/TransactionItem.jsx";

export default function Home() {
 const { user, updateUser } = useAuth();
 const { t } = useLanguage();
 const [transactions, setTransactions] = useState([]);
 const [error, setError] = useState("");

 useEffect(() => {
 async function load() {
 try {
 const [me, tx] = await Promise.all([api.get("/users/me"), api.get("/transactions")]);
 updateUser(me.data.user);
 setTransactions(tx.data.transactions.slice(0, 4));
 setError("");
 } catch {
 setError(t("errorGeneric"));
 }
 }
 load();
 }, []);

 return (
 <div>
 {error && <div className="form-message error" role="alert">{error}</div>}
 <section className="welcome">
 <div>
 <p className="eyebrow">{t("welcome")}</p>
 <h1>{user?.name}</h1>
 <p className="muted">{t("simpleBankingHome")}</p>
 </div>
 <Link to="/help" className="help-circle" aria-label={t("help")}><HelpCircle size={27} /></Link>
 </section>

 <section className="balance-card">
 <span>{t("balance")}</span>
 <strong>₹{Number(user?.balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
 <small>{t("availableBalance")}</small>
 </section>

 <section>
 <h2>{t("quickActions")}</h2>
 <div className="action-grid">
 <ActionCard to="/send" icon={ArrowUpFromLine} title={t("send")} description={t("sendDesc")} />
 <ActionCard to="/receive" icon={ArrowDownToLine} title={t("receive")} description={t("receiveDesc")} />
 <ActionCard to="/transactions" icon={FileText} title={t("transactions")} description={t("transactionsDesc")} />
 <ActionCard to="/bills" icon={Smartphone} title={t("bills")} description={t("billsDesc")} />
 </div>
 </section>

 <section className="recent-section">
 <div className="section-heading">
 <h2>{t("recent")}</h2>
 <Link to="/transactions">{t("seeAll")}</Link>
 </div>
 {transactions.length ? (
 <div className="transaction-list">{transactions.map((tx) => <TransactionItem key={tx._id} transaction={tx} />)}</div>
 ) : <div className="empty-card">{t("noTransactions")}</div>}
 </section>
 </div>
 );
}
