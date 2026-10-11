export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const USE_NEW_ARCHITECTURE = false; // Set to true to enable the new modular architecture
export const WHATSAPP_CONTACT_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210';
export const WHATSAPP_DEFAULT_MESSAGE = "Hi Inviteque! I'm interested in your digital invitation templates and would like to know more.";

export const getWhatsAppLink = (customMsg = WHATSAPP_DEFAULT_MESSAGE) => {
  return `https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent(customMsg)}`;
};
