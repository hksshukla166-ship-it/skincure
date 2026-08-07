import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateWhatsAppMessage(data: {
  patient_name: string;
  age: number;
  gender: string;
  phone: string;
  problem: string;
  preferred_date: string;
  slot_time: string;
}): string {
  const formattedDate = formatDate(data.preferred_date);
  return `Hello Skin Cure, I want to book an appointment.

Patient Name: ${data.patient_name}
Age: ${data.age}
Gender: ${data.gender}
Phone: ${data.phone}
Problem: ${data.problem}
Preferred Date: ${formattedDate}
Selected Time: ${data.slot_time}

Please confirm my appointment.`;
}

export function getWhatsAppUrl(number: string, message: string): string {
  const cleanNumber = number.replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function getCallUrl(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  return `tel:+91${cleanPhone.slice(-10)}`;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
}
