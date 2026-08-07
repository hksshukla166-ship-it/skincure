"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, User, Phone, MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { bookAppointment } from "@/lib/actions";
import { generateWhatsAppMessage, getWhatsAppUrl, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Settings } from "@/types";

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
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (formData.preferred_date) {
      setLoadingSlots(true);
      fetch(`/api/slots?date=${formData.preferred_date}`)
        .then((res) => res.json())
        .then((data) => {
          setAvailableSlots(data.slots || []);
          setFormData((prev) => ({ ...prev, slot_time: "" }));
        })
        .catch(() => setAvailableSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [formData.preferred_date]);

  const minDate = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const result = await bookAppointment({
        ...formData,
        age: parseInt(formData.age),
      });

      if (result.error) {
        toast.error(result.error);
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
    } catch {
      toast.error("Something went wrong. Please try again.");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
            <label className="block text-sm font-medium text-primary-700 mb-1">
              <Clock className="w-4 h-4 inline mr-1" /> {tr("appointment.timeSlot")} *
            </label>
            {loadingSlots ? (
              <div className="flex items-center gap-2 px-4 py-3 text-primary-600">
                <Loader2 className="w-4 h-4 animate-spin" /> ...
              </div>
            ) : (
              <select
                required
                value={formData.slot_time}
                onChange={(e) => setFormData({ ...formData, slot_time: e.target.value })}
                disabled={!formData.preferred_date || availableSlots.length === 0}
                className="w-full px-4 py-3 rounded-xl border border-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/80 disabled:opacity-50"
              >
                <option value="">
                  {!formData.preferred_date
                    ? tr("appointment.selectDateFirst")
                    : availableSlots.length === 0
                    ? tr("appointment.noSlots")
                    : tr("appointment.selectSlot")}
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {formData.preferred_date && formData.slot_time && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-primary-50 border border-primary-100"
          >
            <p className="text-sm text-primary-700">
              <strong>{tr("appointment.selected")}:</strong> {formatDate(formData.preferred_date)} at {formData.slot_time}
            </p>
          </motion.div>
        )}

        <Button type="submit" variant="gold" size="lg" className="w-full" disabled={submitting}>
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
