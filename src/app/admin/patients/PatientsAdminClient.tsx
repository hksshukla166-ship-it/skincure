"use client";

import { useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { importPatientsAction, managePatient } from "@/lib/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Plus, Trash2, Upload, Users, Search, Download } from "lucide-react";
import type { PatientRecipient } from "@/types";
import { chunkArray, type PatientImportRow } from "@/lib/broadcast-utils";

const SAMPLE_CSV = `name,phone,email,city,age,gender,notes
Ramesh Kumar,9876543210,,Bilaspur,35,Male,Regular patient
Sunita Devi,9123456789,,Raipur,28,Female,`;

function parseImportFile(file: File): Promise<PatientImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

        const parsed = rows
          .map((row) => {
            const name = String(row.name || row.Name || row.patient_name || row["Patient Name"] || "").trim();
            const phone = String(row.phone || row.Phone || row.mobile || row.Mobile || "").trim();
            const city = String(row.city || row.City || "").trim();
            const email = String(row.email || row.Email || "").trim();
            const ageRaw = row.age || row.Age;
            const age = ageRaw ? parseInt(String(ageRaw), 10) : null;
            const genderRaw = String(row.gender || row.Gender || "").trim();
            const gender =
              genderRaw === "Male" || genderRaw === "Female" || genderRaw === "Other"
                ? genderRaw
                : null;
            const notes = String(row.notes || row.Notes || "").trim();

            if (!name || !phone) return null;
            return { name, phone, email: email || null, city: city || null, age, gender, notes: notes || null };
          })
          .filter(Boolean) as PatientImportRow[];

        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsBinaryString(file);
  });
}

export default function PatientsAdminClient({
  initialPatients,
  totalCount,
}: {
  initialPatients: PatientRecipient[];
  totalCount: number;
}) {
  const [patients, setPatients] = useState(initialPatients);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        (p.city || "").toLowerCase().includes(q)
    );
  }, [patients, search]);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const result = await managePatient("create", {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      city: formData.get("city"),
      age: formData.get("age"),
      gender: formData.get("gender"),
      notes: formData.get("notes"),
    });

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Patient added!");
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this patient?")) return;
    await managePatient("delete", { id });
    setPatients((prev) => prev.filter((p) => p.id !== id));
    toast.success("Patient deleted");
  };

  const handleToggle = async (id: string, isActive: boolean) => {
    await managePatient("toggle", { id, is_active: !isActive });
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_active: !isActive } : p))
    );
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportProgress("Reading file...");

    try {
      const rows = await parseImportFile(file);
      if (!rows.length) {
        toast.error("No valid rows found. Required columns: name, phone");
        return;
      }

      const chunks = chunkArray(rows, 1000);
      let totalImported = 0;

      for (let i = 0; i < chunks.length; i++) {
        setImportProgress(`Importing batch ${i + 1} of ${chunks.length} (${chunks[i].length} patients)...`);
        const result = await importPatientsAction(chunks[i]);
        if (result.error) {
          toast.error(result.error);
          return;
        }
        totalImported += result.imported || 0;
      }

      toast.success(`Imported ${totalImported.toLocaleString()} patients successfully!`);
      window.location.reload();
    } catch {
      toast.error("Failed to import file. Use CSV or Excel with name and phone columns.");
    } finally {
      setImporting(false);
      setImportProgress("");
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const downloadSample = () => {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "patient-import-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-primary-900 flex items-center gap-2">
              <Users className="w-6 h-6 text-gold-500" />
              Patient Recipients
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add patients once and send notices to all from Broadcasts. Supports 10,000+ patients via bulk import.
            </p>
            <p className="text-sm font-medium text-primary-700 mt-2">
              Total patients: {totalCount.toLocaleString()} · Showing latest {patients.length.toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={downloadSample}>
              <Download className="w-4 h-4" /> Sample CSV
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()} disabled={importing}>
              <Upload className="w-4 h-4" /> {importing ? "Importing..." : "Bulk Import"}
            </Button>
            <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleImport} />
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" /> Add Patient
            </Button>
          </div>
        </div>
        {importProgress && (
          <p className="text-sm text-primary-600 mt-3 animate-pulse">{importProgress}</p>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl p-6 shadow-sm border space-y-4 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <input name="name" placeholder="Patient Name *" required className="w-full px-4 py-2 rounded-xl border" />
            <input name="phone" placeholder="Phone (10 digits) *" required className="w-full px-4 py-2 rounded-xl border" />
            <input name="email" placeholder="Email" className="w-full px-4 py-2 rounded-xl border" />
            <input name="city" placeholder="City" className="w-full px-4 py-2 rounded-xl border" />
            <input name="age" type="number" placeholder="Age" className="w-full px-4 py-2 rounded-xl border" />
            <select name="gender" className="w-full px-4 py-2 rounded-xl border">
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <textarea name="notes" placeholder="Notes" rows={2} className="w-full px-4 py-2 rounded-xl border resize-none" />
          <Button type="submit">Save Patient</Button>
        </form>
      )}

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, or city..."
          className="w-full pl-10 pr-4 py-2 rounded-xl border bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Phone</th>
                <th className="text-left px-4 py-3 font-medium">City</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{patient.name}</td>
                  <td className="px-4 py-3">{patient.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{patient.city || "—"}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggle(patient.id, patient.is_active)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {patient.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(patient.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No patients yet. Add manually or import CSV/Excel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
