export const SITE = {
  name: "SunglassManufacturer.com",
  tagline: "OEM & Private Label Eyewear Manufacturing Partner",
  whatsapp: "+917303681194",
  whatsappRaw: "917303681194",
  email: "rajan@houseofbrands.in",
  moq: 120,
  city: "India",
};

export const waLink = (msg: string, number = SITE.whatsappRaw) =>
  `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
