"use client";

import { useState } from "react";
import { manageFeedbackVideo } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { FeedbackVideo } from "@/types";

export default function FeedbackVideosAdminClient({ videos }: { videos: FeedbackVideo[] }) {
  const [items, setItems] = useState(videos);
  const [showForm, setShowForm] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoUrl) {
      toast.error("Please upload a video first");
      return;
    }

    const formData = new FormData(e.currentTarget);
    await manageFeedbackVideo("create", {
      title: formData.get("title"),
      video_url: videoUrl,
    });
    toast.success("Feedback video added!");
    setShowForm(false);
    setVideoUrl("");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feedback video?")) return;
    await manageFeedbackVideo("delete", { id });
    setItems((prev) => prev.filter((v) => v.id !== id));
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">{items.length} feedback videos</h2>
          <p className="text-sm text-gray-500">Uploaded videos appear in the Patient Feedback section on the homepage.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> Add Video
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
          <FileUpload
            bucket="videos"
            path="feedback"
            currentUrl={videoUrl}
            onUpload={setVideoUrl}
            accept="video/*"
            label="Upload Patient Feedback Video"
          />
          <input name="title" placeholder="Title (optional, e.g. Patient name)" className="w-full px-4 py-2 rounded-xl border" />
          <Button type="submit" disabled={!videoUrl}>Save Video</Button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((video) => (
          <div key={video.id} className="relative group rounded-xl overflow-hidden border bg-white">
            <div className="aspect-[9/16] relative bg-gray-100">
              <video src={video.video_url} className="w-full h-full object-cover" controls playsInline preload="metadata" />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium truncate">{video.title || "Patient feedback"}</p>
            </div>
            <button
              onClick={() => handleDelete(video.id)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-500 bg-white rounded-2xl border">
          No feedback videos yet. Click &quot;Add Video&quot; to upload patient feedback.
        </div>
      )}
    </div>
  );
}
