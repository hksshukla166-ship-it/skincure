"use client";

import { useState } from "react";
import { submitContactForm } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    }
    setSubmitting(false);
  };

  return (
    <GlassCard>
      <h2 className="font-display text-2xl font-bold text-primary-900 mb-6">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name *"
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
        />
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Your Message *"
          className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 resize-none"
        />
        <Button type="submit" variant="primary" disabled={submitting} className="w-full">
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          Send Message
        </Button>
      </form>
    </GlassCard>
  );
}
