"use client";

import { useState } from "react";
import {
  createBroadcastAction,
  startBroadcastAction,
  sendBroadcastBatchAction,
  deleteBroadcastAction,
} from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Bell, Send, Trash2, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { Broadcast } from "@/types";
import Link from "next/link";

export default function BroadcastsAdminClient({
  initialBroadcasts,
  activePatientCount,
  whatsappConfigured,
}: {
  initialBroadcasts: Broadcast[];
  activePatientCount: number;
  whatsappConfigured: boolean;
}) {
  const [broadcasts, setBroadcasts] = useState(initialBroadcasts);
  const [title, setTitle] = useState("");
  const [notice, setNotice] = useState(
    "Dear {name}, this is a notice from SKIN CURE clinic. {city}"
  );
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ sent: number; failed: number; total: number } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createBroadcastAction(title, notice);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Notice created! Click Send to All to deliver.");
    window.location.reload();
  };

  const runBroadcast = async (broadcastId: string, resume = false) => {
    setSendingId(broadcastId);
    setProgress(null);

    let total = 0;

    if (!resume) {
      const startResult = await startBroadcastAction(broadcastId);
      if (startResult.error) {
        toast.error(startResult.error);
        setSendingId(null);
        return;
      }

      if (!startResult.whatsappConfigured) {
        toast.error("Configure WhatsApp Cloud API in .env.local before sending.");
        setSendingId(null);
        return;
      }

      total = startResult.total || 0;
    } else {
      const existing = broadcasts.find((b) => b.id === broadcastId);
      total = existing?.total_recipients || 0;
      if (!whatsappConfigured) {
        toast.error("Configure WhatsApp Cloud API in .env.local before sending.");
        setSendingId(null);
        return;
      }
    }

    setProgress({
      sent: broadcasts.find((b) => b.id === broadcastId)?.sent_count || 0,
      failed: broadcasts.find((b) => b.id === broadcastId)?.failed_count || 0,
      total,
    });
    toast.info(`Sending to ${total.toLocaleString()} patients...`);

    let done = false;
    while (!done) {
      const batchResult = await sendBroadcastBatchAction(broadcastId, 50);
      if (batchResult.error) {
        toast.error(batchResult.error);
        break;
      }

      setProgress({
        sent: batchResult.sent || 0,
        failed: batchResult.failed || 0,
        total: batchResult.total || total,
      });

      done = Boolean(batchResult.done);
      if (!done) {
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    toast.success("Broadcast completed!");
    setSendingId(null);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this broadcast?")) return;
    await deleteBroadcastAction(id);
    setBroadcasts((prev) => prev.filter((b) => b.id !== id));
    toast.success("Deleted");
  };

  const statusColor = (status: Broadcast["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "sending":
      case "queued":
        return "bg-blue-100 text-blue-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {!whatsappConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">WhatsApp Cloud API required for automatic bulk send</p>
            <p className="mt-1">
              Add <code className="bg-amber-100 px-1 rounded">WHATSAPP_CLOUD_API_TOKEN</code> and{" "}
              <code className="bg-amber-100 px-1 rounded">WHATSAPP_PHONE_NUMBER_ID</code> to{" "}
              <code className="bg-amber-100 px-1 rounded">.env.local</code> (Meta WhatsApp Business).
              Without this, notices can be created but not auto-sent.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h1 className="text-xl font-bold text-primary-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-gold-500" />
          Patient Notices / Broadcasts
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Write one notice and send it to all {activePatientCount.toLocaleString()} active patients at once via WhatsApp.
        </p>
        {activePatientCount === 0 && (
          <p className="text-sm text-amber-700 mt-2">
            No active patients yet.{" "}
            <Link href="/admin/patients" className="underline font-medium">
              Add or import patients first
            </Link>
            .
          </p>
        )}
      </div>

      <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <h2 className="font-semibold text-primary-900">Create New Notice</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notice title (e.g. Clinic Holiday Notice)"
          required
          className="w-full px-4 py-2 rounded-xl border"
        />
        <textarea
          value={notice}
          onChange={(e) => setNotice(e.target.value)}
          placeholder="Your notice message..."
          required
          rows={6}
          className="w-full px-4 py-2 rounded-xl border resize-none"
        />
        <p className="text-xs text-gray-500">
          Personalization: use <code>{"{name}"}</code>, <code>{"{phone}"}</code>, <code>{"{city}"}</code> in your message.
        </p>
        <Button type="submit" disabled={activePatientCount === 0}>
          Save Notice
        </Button>
      </form>

      {sendingId && progress && (
        <div className="bg-primary-50 border border-primary-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-primary-900 font-medium mb-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending messages...
          </div>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary-600 h-full transition-all duration-300"
              style={{
                width: `${Math.min(100, ((progress.sent + progress.failed) / progress.total) * 100)}%`,
              }}
            />
          </div>
          <p className="text-sm text-primary-700 mt-2">
            Sent: {progress.sent.toLocaleString()} · Failed: {progress.failed.toLocaleString()} · Total:{" "}
            {progress.total.toLocaleString()}
          </p>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="font-semibold text-primary-900">Past Notices</h2>
        {broadcasts.map((broadcast) => (
          <div key={broadcast.id} className="bg-white rounded-xl p-5 shadow-sm border">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-primary-900">{broadcast.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusColor(broadcast.status)}`}>
                    {broadcast.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap">{broadcast.notice}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {broadcast.total_recipients > 0
                    ? `Sent ${broadcast.sent_count}/${broadcast.total_recipients} · Failed ${broadcast.failed_count}`
                    : `Created ${new Date(broadcast.created_at).toLocaleString("en-IN")}`}
                </p>
              </div>
              <div className="flex gap-2">
                {(broadcast.status === "draft" || broadcast.status === "failed") && (
                  <Button
                    size="sm"
                    onClick={() => runBroadcast(broadcast.id)}
                    disabled={!!sendingId || activePatientCount === 0 || !whatsappConfigured}
                  >
                    {sendingId === broadcast.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Send to All
                  </Button>
                )}
                {(broadcast.status === "sending" || broadcast.status === "queued") && (
                  <Button
                    size="sm"
                    onClick={() => runBroadcast(broadcast.id, true)}
                    disabled={!!sendingId || !whatsappConfigured}
                  >
                    {sendingId === broadcast.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Resume Send
                  </Button>
                )}
                {broadcast.status === "completed" && (
                  <span className="inline-flex items-center gap-1 text-green-600 text-sm px-3 py-2">
                    <CheckCircle2 className="w-4 h-4" /> Done
                  </span>
                )}
                <button
                  onClick={() => handleDelete(broadcast.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  disabled={!!sendingId}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!broadcasts.length && (
          <p className="text-gray-500 text-sm">No notices yet. Create one above to broadcast to all patients.</p>
        )}
      </div>
    </div>
  );
}
