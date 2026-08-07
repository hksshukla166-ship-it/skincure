"use client";

import { useState } from "react";
import { updateSettings, setupSupabaseStorage } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { Loader2, Database } from "lucide-react";
import type { Settings } from "@/types";

export default function SettingsAdminClient({ settings }: { settings: Settings | null }) {
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url || "");
  const [loading, setLoading] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);

  const handleSetupBuckets = async () => {
    setSetupLoading(true);
    try {
      const result = await setupSupabaseStorage();
      toast.success(`Buckets ready! Created: ${result.created.join(", ") || "none"}. Existing: ${result.existing.length}`);
      if (result.errors.length) toast.error(result.errors.join("; "));
    } catch {
      toast.error("Failed to setup buckets");
    }
    setSetupLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("logo_url", logoUrl);
    const result = await updateSettings(formData);
    if (result.success) toast.success("Settings updated!");
    else toast.error("Failed to update");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-2">Storage Setup</h3>
        <p className="text-sm text-gray-500 mb-4">Auto-create all Supabase storage buckets (logo, gallery, doctor-images, etc.)</p>
        <Button type="button" variant="outline" onClick={handleSetupBuckets} disabled={setupLoading}>
          {setupLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          Create Storage Buckets
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4">Clinic Logo</h3>
        <FileUpload bucket="logo" path="clinic" currentUrl={logoUrl} onUpload={setLogoUrl} label="Upload Logo (shows on homepage navbar)" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Clinic Name</label>
            <input name="clinic_name" defaultValue={settings?.clinic_name} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input name="phone" defaultValue={settings?.phone} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">WhatsApp Number (with country code)</label>
            <input name="whatsapp_number" defaultValue={settings?.whatsapp_number} placeholder="917828093301" className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Opening Hours</label>
            <input name="opening_hours" defaultValue={settings?.opening_hours} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Google Rating</label>
            <input name="google_rating" type="number" step="0.1" defaultValue={settings?.google_rating} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Google Reviews Count</label>
            <input name="google_reviews_count" type="number" defaultValue={settings?.google_reviews_count} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Max Patients Per Day</label>
            <input name="max_patients_per_day" type="number" defaultValue={settings?.max_patients_per_day} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Patient Counter (displayed on homepage)</label>
            <input name="patient_counter" type="number" defaultValue={settings?.patient_counter} className="w-full px-4 py-2 rounded-xl border" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea name="address" defaultValue={settings?.address} rows={3} className="w-full px-4 py-2 rounded-xl border resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Google Maps Embed URL</label>
          <input name="google_maps_link" defaultValue={settings?.google_maps_link || ""} className="w-full px-4 py-2 rounded-xl border" placeholder="https://www.google.com/maps/embed?pb=..." />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" name="holiday_mode" value="true" defaultChecked={settings?.holiday_mode} id="holiday_mode" className="w-4 h-4" />
          <label htmlFor="holiday_mode" className="text-sm font-medium">Holiday Mode (disable bookings)</label>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
