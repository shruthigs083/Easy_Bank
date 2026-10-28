export default function ProtectedFormMessage({ children, type = "info" }) {
 return <div className={`form-message ${type}`} role={type === "error" ? "alert" : "status"}>{children}</div>;
}
