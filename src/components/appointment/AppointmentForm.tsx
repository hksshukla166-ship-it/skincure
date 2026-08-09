"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, MessageSquare, Loader2, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { generateWhatsAppMessage, getWhatsAppUrl, formatDate } from "@/lib/utils";
import { bookAppointmentAction } from "@/lib/book-appointment-action";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Settings } from "@/types";

const TIME_OPTIONS = [
  { value: "Morning", labelKey: "morning" as const, icon: Sun },
  { value: "Evening", labelKey: "evening" as const, icon: Moon },
];

interface AppointmentFormProps {
  settings: Settings | null;
}

export function AppointmentForm({ settings }: AppointmentFormProps) {
  const { tr } = useLanguage();
  const [formData, setFormData] = useState({
    patient_name: "",
    age: "",
    gender: "Male" as "Male" | "Female" | "Other",
    phone: "",
    problem: "",
    preferred_date: "",
    slot_time: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slot_time) {
      toast.error("Please select Morning or Evening");
      return;
    }
    setSubmitting(true);

    try {
      const result = await bookAppointmentAction({
        ...formData,
        age: parseInt(formData.age, 10),
      });

      if (!result?.success) {
        toast.error(result?.error || "Failed to book appointment. Please try again.");
        return;
      }

      const whatsappNumber = settings?.whatsapp_number || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917828093301";
      const message = generateWhatsAppMessage({
        patient_name: formData.patient_name,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        problem: formData.problem,
        preferred_date: formData.preferred_date,
        slot_time: formData.slot_time,
      });

      toast.success("Appointment booked! Opening WhatsApp to confirm...");

      setTimeout(() => {
        window.open(getWhatsAppUrl(whatsappNumber, message), "_blank");
      }, 1000);

      setFormData({
        patient_name: "",
        age: "",
        gender: "Male",
        phone: "",
        problem: "",
        preferred_date: "",
        slot_time: "",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GlassCard className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="font-display text-3xl font-bold text-primary-900 mb-2">{tr("appointment.formTitle")}</h2>
        <p className="text-primary-600">{tr("appointment.formSubtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              <User className="w-4 h-4 inline mr-1" /> {tr("appointment.fullName")} *
            </label>
            <input
              type="text"
              required
              value={formData.patient_name}
              onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
              placeholder={tr("appointment.namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">{tr("appointment.age")} *</label>
            <input
              type="number"
              required
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
              placeholder={tr("appointment.agePlaceholder")}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">{tr("appointment.gender")} *</label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Male" | "Female" | "Other" })}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
            >
              <option value="Male">{tr("appointment.male")}</option>
              <option value="Female">{tr("appointment.female")}</option>
              <option value="Other">{tr("appointment.other")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" /> {tr("appointment.phone")} *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
              placeholder={tr("appointment.phonePlaceholder")}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">
            <MessageSquare className="w-4 h-4 inline mr-1" /> {tr("appointment.problem")} *
          </label>
          <textarea
            required
            rows={3}
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 resize-none"
            placeholder={tr("appointment.problemPlaceholder")}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" /> {tr("appointment.preferredDate")} *
          </label>
          <input
            type="date"
            required
            min={minDate}
            value={formData.preferred_date}
            onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            <Clock className="w-4 h-4 inline mr-1" /> {tr("appointment.preferredTime")} *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TIME_OPTIONS.map(({ value, labelKey, icon: Icon }) => {
              const selected = formData.slot_time === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, slot_time: value })}
                  className={`flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 font-medium transition-all ${
                    selected
                      ? "border-gold-500 bg-gold-50 text-primary-900 shadow-sm"
                      : "border-primary-200 bg-white/80 text-primary-700 hover:border-primary-300"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${selected ? "text-gold-600" : "text-primary-500"}`} />
                  {tr(`appointment.${labelKey}`)}
                </button>
              );
            })}
          </div>
        </div>

        {formData.preferred_date && formData.slot_time && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary-50 border border-primary-100"
          >
            <p className="text-sm text-primary-700">
              <strong>{tr("appointment.selected")}:</strong> {formatDate(formData.preferred_date)} — {formData.slot_time}
            </p>
          </motion.div>
        )}

        <Button
          type="submit"
          variant="gold"
          size="lg"
          className="w-full"
          disabled={submitting || !formData.slot_time}
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {tr("appointment.booking")}
            </>
          ) : (
            tr("appointment.submit")
          )}
        </Button>
      </form>
    </GlassCard>
  );
}
