import AdminLoginClient from "@/app/admin/login/AdminLoginClient";
import { loginFormAction } from "./actions";

export default function LoginPage() {
  return <AdminLoginClient loginAction={loginFormAction} />;
}
