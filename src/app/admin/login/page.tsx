import { initializeAdmin } from "@/lib/auth";
import AdminLoginClient from "./AdminLoginClient";

export default async function AdminLoginPage() {
  await initializeAdmin();
  return <AdminLoginClient />;
}
