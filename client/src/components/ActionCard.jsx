import { Link } from "react-router-dom";

export default function ActionCard({ to, icon: Icon, title, description }) {
 return (
 <Link to={to} className="action-card">
 <span className="action-icon"><Icon size={32} strokeWidth={2} /></span>
 <span>
 <strong>{title}</strong>
 <small>{description}</small>
 </span>
 </Link>
 );
}
