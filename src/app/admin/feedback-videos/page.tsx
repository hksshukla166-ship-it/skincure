import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import FeedbackVideosAdminClient from "./FeedbackVideosAdminClient";

export default async function FeedbackVideosAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const supabase = createAdminClient();
  const { data } = await supabase.from("feedback_videos").select("*").order("sort_order");

  return <FeedbackVideosAdminClient videos={data || []} />;
}
