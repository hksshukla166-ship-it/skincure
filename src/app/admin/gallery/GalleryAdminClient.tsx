"use client";

import { useState } from "react";
import { manageGallery } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import type { GalleryItem } from "@/types";

export default function GalleryAdminClient({ items }: { items: GalleryItem[] }) {
  const [gallery, setGallery] = useState(items);
  const [showForm, setShowForm] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageGallery("create", {
      title: formData.get("title"),
      media_url: mediaUrl,
      media_type: mediaType,
      category: formData.get("category"),
    });
    toast.success("Gallery item added!");
    setShowForm(false);
    setMediaUrl("");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await manageGallery("delete", { id });
    setGallery((prev) => prev.filter((g) => g.id !== id));
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{gallery.length} items</h2>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Add Media</Button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
          <div className="flex gap-4 mb-4">
            <button type="button" onClick={() => setMediaType("image")} className={`px-4 py-2 rounded-lg ${mediaType === "image" ? "bg-primary-800 text-white" : "bg-gray-100"}`}>Image</button>
            <button type="button" onClick={() => setMediaType("video")} className={`px-4 py-2 rounded-lg ${mediaType === "video" ? "bg-primary-800 text-white" : "bg-gray-100"}`}>Video</button>
          </div>
          <FileUpload bucket={mediaType === "video" ? "videos" : "gallery"} path="media" currentUrl={mediaUrl} onUpload={setMediaUrl} accept={mediaType === "video" ? "video/*" : "image/*"} />
          <input name="title" placeholder="Title (optional)" className="w-full px-4 py-2 rounded-xl border" />
          <select name="category" className="w-full px-4 py-2 rounded-xl border">
            <option value="general">General</option>
            <option value="before_after">Before & After</option>
            <option value="clinic">Clinic</option>
            <option value="treatment">Treatment</option>
          </select>
          <Button type="submit" disabled={!mediaUrl}>Add to Gallery</Button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden border">
            <div className="aspect-square relative bg-gray-100">
              {item.media_type === "video" ? (
                <video src={item.media_url} className="w-full h-full object-cover" />
              ) : (
                <Image src={item.media_url} alt={item.title || ""} fill className="object-cover" />
              )}
            </div>
            <div className="p-2">
              <p className="text-sm font-medium truncate">{item.title || "Untitled"}</p>
              <p className="text-xs text-gray-500">{item.category}</p>
            </div>
            <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
