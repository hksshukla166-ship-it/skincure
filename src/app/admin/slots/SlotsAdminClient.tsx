"use client";

import { useState } from "react";
import { manageSlot, manageHoliday } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import type { AppointmentSlot, HolidaySchedule } from "@/types";

export default function SlotsAdminClient({ slots, holidays }: { slots: AppointmentSlot[]; holidays: HolidaySchedule[] }) {
  const [slotList, setSlotList] = useState(slots);
  const [holidayList, setHolidayList] = useState(holidays);

  const handleAddSlot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageSlot("create", { slot_time: formData.get("slot_time") });
    toast.success("Slot added!");
    window.location.reload();
  };

  const handleToggleSlot = async (id: string, isActive: boolean) => {
    await manageSlot("update", { id, is_active: !isActive });
    setSlotList((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !isActive } : s));
  };

  const handleDeleteSlot = async (id: string) => {
    await manageSlot("delete", { id });
    setSlotList((prev) => prev.filter((s) => s.id !== id));
    toast.success("Deleted!");
  };

  const handleAddHoliday = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await manageHoliday("create", {
      date: formData.get("date"),
      reason: formData.get("reason"),
      is_closed: true,
    });
    toast.success("Holiday added!");
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4">Add Time Slot</h3>
        <form onSubmit={handleAddSlot} className="flex gap-3">
          <input name="slot_time" placeholder="e.g. 9:00 AM" required className="flex-1 px-4 py-2 rounded-xl border" />
          <Button type="submit"><Plus className="w-4 h-4" /> Add</Button>
        </form>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4">Time Slots ({slotList.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {slotList.map((slot) => (
            <div key={slot.id} className={`flex items-center justify-between p-3 rounded-xl border ${slot.is_active ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"}`}>
              <span className="font-medium">{slot.slot_time}</span>
              <div className="flex gap-1">
                <button onClick={() => handleToggleSlot(slot.id, slot.is_active)} className="p-1">
                  {slot.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </button>
                <button onClick={() => handleDeleteSlot(slot.id)} className="p-1 text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4">Holiday Schedule</h3>
        <form onSubmit={handleAddHoliday} className="flex gap-3 mb-4">
          <input name="date" type="date" required className="px-4 py-2 rounded-xl border" />
          <input name="reason" placeholder="Reason" className="flex-1 px-4 py-2 rounded-xl border" />
          <Button type="submit">Add Holiday</Button>
        </form>
        <div className="space-y-2">
          {holidayList.map((h) => (
            <div key={h.id} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
              <span>{h.date} - {h.reason || "Closed"}</span>
              <button onClick={async () => { await manageHoliday("delete", { id: h.id }); setHolidayList((prev) => prev.filter((x) => x.id !== h.id)); }} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
