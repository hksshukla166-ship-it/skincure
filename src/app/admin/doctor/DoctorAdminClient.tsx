"use client";

import { useState } from "react";
import { updateDoctor } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/admin/FileUpload";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Doctor } from "@/types";

export default function DoctorAdminClient({ doctor }: { doctor: Doctor | null }) {
  const [imageUrl, setImageUrl] = useState(doctor?.image_url || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("image_url", imageUrl);
    const result = await updateDoctor(formData);
    if (result.success) toast.success("Doctor profile updated!");
    else toast.error("Failed to update");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold text-primary-900 mb-4">Doctor Photo</h3>
        <FileUpload bucket="doctor-images" path="doctor" currentUrl={imageUrl} onUpload={setImageUrl} label="Upload Doctor Photo (shows on homepage)" />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" defaultValue={doctor?.name} required className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Qualification</label>
            <input name="qualification" defaultValue={doctor?.qualification} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Experience</label>
            <input name="experience" defaultValue={doctor?.experience} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <input name="specialization" defaultValue={doctor?.specialization} className="w-full px-4 py-2 rounded-xl border" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Honor / Title (shown below qualification on homepage)</label>
            <input name="honor_title" defaultValue={doctor?.honor_title || "Ex president IADVL CG 2025"} className="w-full px-4 py-2 rounded-xl border" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Clinic Timing</label>
          <input name="clinic_timing" defaultValue={doctor?.clinic_timing} className="w-full px-4 py-2 rounded-xl border" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">About Doctor</label>
          <textarea name="about" defaultValue={doctor?.about || ""} rows={6} className="w-full px-4 py-2 rounded-xl border resize-none" />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
