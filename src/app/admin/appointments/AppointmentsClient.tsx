"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Search, Download, Printer, Check, X, Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Appointment } from "@/types";

interface AppointmentsClientProps {
  appointments: Appointment[];
}

export default function AppointmentsClient({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = appointments.filter((a) => {
    const matchesSearch = !filter || 
      a.patient_name.toLowerCase().includes(filter.toLowerCase()) ||
      a.phone.includes(filter) ||
      a.problem.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatus = async (id: string, status: string) => {
    const result = await updateAppointmentStatus(id, status);
    if (result.error) {
      toast.error(result.error);
    } else {
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: status as Appointment["status"] } : a));
      toast.success(`Appointment ${status}`);
    }
  };

  const exportCSV = () => {
    const headers = ["Name", "Age", "Gender", "Phone", "Problem", "Date", "Time", "Status"];
    const rows = filtered.map((a) => [a.patient_name, a.age, a.gender, a.phone, a.problem, a.preferred_date, a.slot_time, a.status]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
    rescheduled: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search patients..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Patient</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Problem</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Date & Time</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((apt) => (
                <tr key={apt.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{apt.patient_name}</p>
                    <p className="text-sm text-gray-500">{apt.age} yrs · {apt.gender}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{apt.phone}</td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate">{apt.problem}</td>
                  <td className="px-4 py-3 text-sm">
                    <p>{formatDate(apt.preferred_date)}</p>
                    <p className="text-gray-500">{apt.slot_time}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[apt.status]}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {apt.status === "pending" && (
                        <>
                          <button onClick={() => handleStatus(apt.id, "approved")} className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200" title="Approve"><Check className="w-4 h-4" /></button>
                          <button onClick={() => handleStatus(apt.id, "rejected")} className="p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200" title="Reject"><X className="w-4 h-4" /></button>
                        </>
                      )}
                      {apt.status === "approved" && (
                        <button onClick={() => handleStatus(apt.id, "completed")} className="p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200" title="Complete"><Check className="w-4 h-4" /></button>
                      )}
                      {!["cancelled", "rejected", "completed"].includes(apt.status) && (
                        <button onClick={() => handleStatus(apt.id, "cancelled")} className="p-1.5 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" title="Cancel"><X className="w-4 h-4" /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <p className="text-center py-12 text-gray-500">No appointments found</p>
          )}
        </div>
      </div>
    </div>
  );
}
