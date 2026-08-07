export interface PatientImportRow {
  name: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  age?: number | null;
  gender?: "Male" | "Female" | "Other" | null;
  notes?: string | null;
}

export function normalizeWhatsAppPhone(phone: string, countryCode = "91"): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0") && digits.length === 11) {
    digits = digits.slice(1);
  }
  if (digits.length === 10) {
    digits = countryCode + digits;
  }
  return digits;
}

export function renderBroadcastMessage(
  template: string,
  patient: { name: string; phone: string; city?: string | null }
): string {
  return template
    .replace(/\{name\}/gi, patient.name)
    .replace(/\{phone\}/gi, patient.phone)
    .replace(/\{city\}/gi, patient.city || "");
}

export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
