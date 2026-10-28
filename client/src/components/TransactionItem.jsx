import { useLanguage } from "../context/LanguageContext.jsx";

export default function TransactionItem({ transaction }) {
 const { t, language } = useLanguage();
 const isCredit = transaction.type === "credit";
 const description = transaction.category === "transfer"
 ? (isCredit ? t("moneyReceivedDescription") : t("moneySentDescription"))
 : transaction.category === "recharge" ? t("rechargeDescription") : t("billDescription");

 return (
 <div className="transaction-item">
 <div className={`transaction-icon ${isCredit ? "credit" : "debit"}`}>{isCredit ? "+" : "−"}</div>
 <div className="transaction-info">
 <strong>{description}{transaction.relatedUser?.name ? ` ${transaction.relatedUser.name}` : ""}</strong>
 <small>{new Date(transaction.createdAt).toLocaleString(language === "kn" ? "kn-IN" : language === "hi" ? "hi-IN" : "en-IN")}</small>
 </div>
 <strong className={isCredit ? "amount-credit" : "amount-debit"}>
 {isCredit ? "+" : "−"}₹{Number(transaction.amount).toFixed(2)}
 </strong>
 </div>
 );
}
