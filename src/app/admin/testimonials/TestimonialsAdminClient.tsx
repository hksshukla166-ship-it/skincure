"use client";

import { useState } from "react";
import { manageTestimonial } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { Plus, Trash2, Star } from "lucide-react";
import type { Testimonial } from "@/types";

export default function TestimonialsAdminClient({ testimonials }: { testimonials: Testimonial[] }) {
  const [items, setItems] = useState(testimonials);
  const [showForm, setShowForm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageTestimonial("create", {
      patient_name: formData.get("patient_name"),
      city: formData.get("city"),
      rating: parseInt(formData.get("rating") as string),
      review: formData.get("review"),
      photo_url: photoUrl,
    });
    toast.success("Testimonial added!");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await manageTestimonial("delete", { id });
    setItems((prev) => prev.filter((t) => t.id !== id));
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Add Testimonial</Button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4 max-w-lg">
          <input name="patient_name" placeholder="Patient Name" required className="w-full px-4 py-2 rounded-xl border" />
          <input name="city" placeholder="City" className="w-full px-4 py-2 rounded-xl border" />
          <select name="rating" defaultValue="5" className="w-full px-4 py-2 rounded-xl border">
            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
          </select>
          <textarea name="review" placeholder="Review" required rows={4} className="w-full px-4 py-2 rounded-xl border resize-none" />
          <FileUpload bucket="testimonials" path="photos" currentUrl={photoUrl} onUpload={setPhotoUrl} label="Patient Photo (optional)" />
          <Button type="submit">Add Testimonial</Button>
        </form>
      )}

      <div className="grid gap-4">
        {items.map((t) => (
          <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{t.patient_name}</h3>
                <div className="flex">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-gold-500 fill-current" />)}</div>
              </div>
              <p className="text-sm text-gray-500">{t.city}</p>
              <p className="text-sm mt-2">{t.review}</p>
            </div>
            <button onClick={() => handleDelete(t.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
