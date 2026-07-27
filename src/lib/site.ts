export const SITE = {
  name: "SunglassManufacturer.com",
  tagline: "OEM & Private Label Eyewear Manufacturing Partner",
  whatsapp: "+917303681194",
  whatsappRaw: "917303681194",
  email: "rajan@houseofbrands.in",
  moq: 12,
  moqCompact: "MOQ from 12 pcs",
  moqMedium: "Low MOQ from 12 pcs",
  moqDetailed:
    "Low MOQ from 12 pcs for applicable designs. Fully customised OEM developments may require a different MOQ.",
  city: "India",
};

export const waLink = (msg: string, number = SITE.whatsappRaw) =>
  `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
