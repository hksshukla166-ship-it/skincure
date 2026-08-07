"use client";

import { useState } from "react";
import { manageService } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Plus, Trash2, Edit } from "lucide-react";
import type { Service } from "@/types";

export default function ServicesAdminClient({ services }: { services: Service[] }) {
  const [items, setItems] = useState(services);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageService("create", {
      title: formData.get("title"),
      description: formData.get("description"),
      icon: formData.get("icon"),
    });
    toast.success("Service added!");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await manageService("delete", { id });
    setItems((prev) => prev.filter((s) => s.id !== id));
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Add Service</Button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4 max-w-lg">
          <input name="title" placeholder="Service Title" required className="w-full px-4 py-2 rounded-xl border" />
          <textarea name="description" placeholder="Description" rows={3} className="w-full px-4 py-2 rounded-xl border resize-none" />
          <input name="icon" placeholder="Icon name (e.g. sparkles, scissors)" defaultValue="sparkles" className="w-full px-4 py-2 rounded-xl border" />
          <Button type="submit">Add Service</Button>
        </form>
      )}

      <div className="grid gap-4">
        {items.map((service) => (
          <div key={service.id} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
            </div>
            <button onClick={() => handleDelete(service.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
