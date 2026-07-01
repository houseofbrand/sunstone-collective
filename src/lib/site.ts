export const SITE = {
  name: "OEMSunglasses.com",
  tagline: "OEM Sunglasses Manufacturer | Private Label & Wholesale",
  whatsapp: "+917303681194",
  whatsappRaw: "917303681194",
  email: "sales@oemsunglasses.com",
  moq: 12,
  city: "India",
};

export const waLink = (msg: string, number = SITE.whatsappRaw) =>
  `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
