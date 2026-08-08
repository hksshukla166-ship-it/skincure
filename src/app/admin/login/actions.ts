"use server";

import { redirect } from "next/navigation";
import { authenticateAdmin } from "@/lib/admin-login";
import { createSession } from "@/lib/auth";

export async function loginAdminAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");

  const result = await authenticateAdmin(
    typeof username === "string" ? username : "",
    typeof password === "string" ? password : ""
  );

  if (!result.ok) {
    redirect(`/admin/login?error=${encodeURIComponent(result.error)}`);
  }

  await createSession(result.userId);
  redirect("/admin/dashboard");
}
