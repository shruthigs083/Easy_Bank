import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
 const [user, setUser] = useState(() => {
 try {
 const saved = localStorage.getItem("easybank_user");
 return saved ? JSON.parse(saved) : null;
 } catch {
 localStorage.removeItem("easybank_user");
 return null;
 }
 });
 const [loading, setLoading] = useState(true);

 useEffect(() => {
 async function restore() {
 const token = localStorage.getItem("easybank_token");

 if (!token) {
 setLoading(false);
 return;
 }

 try {
 const response = await api.get("/users/me");
 setUser(response.data.user);
 localStorage.setItem("easybank_user", JSON.stringify(response.data.user));
 } catch (error) {
 if (error.response?.status === 401) {
 localStorage.removeItem("easybank_token");
 localStorage.removeItem("easybank_user");
 setUser(null);
 }
 } finally {
 setLoading(false);
 }
 }

 restore();
 }, []);

 function saveAuth(data) {
 localStorage.setItem("easybank_token", data.token);
 localStorage.setItem("easybank_user", JSON.stringify(data.user));
 setUser(data.user);
 }

 async function login(email, password) {
 const { data } = await api.post("/auth/login", { email, password });
 saveAuth(data);
 return data;
 }

 async function register(payload) {
 const { data } = await api.post("/auth/register", payload);
 saveAuth(data);
 return data;
 }

 function logout() {
 localStorage.removeItem("easybank_token");
 localStorage.removeItem("easybank_user");
 setUser(null);
 }

 function updateUser(partial) {
 setUser((current) => {
 const updated = { ...current, ...partial };
 localStorage.setItem("easybank_user", JSON.stringify(updated));
 return updated;
 });
 }

 return (
 <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
 {children}
 </AuthContext.Provider>
 );
}

export function useAuth() {
 return useContext(AuthContext);
}
