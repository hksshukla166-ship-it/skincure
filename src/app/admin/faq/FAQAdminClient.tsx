"use client";

import { useState } from "react";
import { manageFAQ } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import type { FAQ } from "@/types";

export default function FAQAdminClient({ faqs }: { faqs: FAQ[] }) {
  const [items, setItems] = useState(faqs);
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageFAQ("create", {
      question: formData.get("question"),
      answer: formData.get("answer"),
    });
    toast.success("FAQ added!");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await manageFAQ("delete", { id });
    setItems((prev) => prev.filter((f) => f.id !== id));
    toast.success("Deleted!");
  };

  return (
    <div className="space-y-6">
      <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Add FAQ</Button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4 max-w-lg">
          <input name="question" placeholder="Question" required className="w-full px-4 py-2 rounded-xl border" />
          <textarea name="answer" placeholder="Answer" required rows={4} className="w-full px-4 py-2 rounded-xl border resize-none" />
          <Button type="submit">Add FAQ</Button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((faq) => (
          <div key={faq.id} className="bg-white rounded-xl p-4 shadow-sm border flex justify-between">
            <div>
              <h3 className="font-semibold">{faq.question}</h3>
              <p className="text-sm text-gray-600 mt-1">{faq.answer}</p>
            </div>
            <button onClick={() => handleDelete(faq.id)} className="p-2 text-red-500"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
