import { normalizeWhatsAppPhone } from "@/lib/broadcast-utils";

export function isWhatsAppCloudConfigured(): boolean {
  return Boolean(
    process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
  );
}

export async function sendWhatsAppTextMessage(
  phone: string,
  message: string
): Promise<{ success: boolean; error?: string }> {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION || "v21.0";

  if (!token || !phoneNumberId) {
    return {
      success: false,
      error: "WhatsApp Cloud API is not configured. Add WHATSAPP_CLOUD_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID to .env.local",
    };
  }

  const to = normalizeWhatsAppPhone(phone);

  try {
    const response = await fetch(
      `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to,
          type: "text",
          text: { preview_url: false, body: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMessage =
        data?.error?.message ||
        data?.error?.error_user_msg ||
        `WhatsApp API error (${response.status})`;
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send WhatsApp message",
    };
  }
}
