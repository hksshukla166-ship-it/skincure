"use client";

import { useState } from "react";
import { manageBlog } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { Blog } from "@/types";

export default function BlogsAdminClient({ blogs }: { blogs: Blog[] }) {
  const [items, setItems] = useState(blogs);
  const [showForm, setShowForm] = useState(false);
  const [coverUrl, setCoverUrl] = useState("");

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageBlog("create", {
      title: formData.get("title"),
      excerpt: formData.get("excerpt"),
      content: formData.get("content"),
      cover_image_url: coverUrl,
      meta_title: formData.get("meta_title"),
      meta_description: formData.get("meta_description"),
      is_published: formData.get("is_published") === "on",
    });
    toast.success("Blog created!");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await manageBlog("delete", { id });
    setItems((prev) => prev.filter((b) => b.id !== id));
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Article</Button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
          <input name="title" placeholder="Title" required className="w-full px-4 py-2 rounded-xl border" />
          <input name="excerpt" placeholder="Excerpt" className="w-full px-4 py-2 rounded-xl border" />
          <textarea name="content" placeholder="Content" required rows={10} className="w-full px-4 py-2 rounded-xl border resize-none" />
          <FileUpload bucket="blogs" path="covers" currentUrl={coverUrl} onUpload={setCoverUrl} label="Cover Image" />
          <input name="meta_title" placeholder="SEO Title" className="w-full px-4 py-2 rounded-xl border" />
          <input name="meta_description" placeholder="SEO Description" className="w-full px-4 py-2 rounded-xl border" />
          <label className="flex items-center gap-2"><input type="checkbox" name="is_published" /> Publish immediately</label>
          <Button type="submit">Create Article</Button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((blog) => (
          <div key={blog.id} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{blog.title}</h3>
              <p className="text-sm text-gray-500">{blog.is_published ? "Published" : "Draft"} · /blog/{blog.slug}</p>
            </div>
            <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
