export const SITE = {
  name: "SunglassManufacturer.com",
  tagline: "OEM & Private Label Eyewear Manufacturing Partner",
  whatsapp: "+917303681194",
  whatsappRaw: "917303681194",
  email: "rajan@houseofbrands.in",
  moq: 120,
  moqCompact: "MOQ: 120 pcs",
  moqMedium: "MOQ: 120 pcs | Mix up to 10 models",
  moqDetailed: "MOQ: 120 pcs (Mix up to 10 models, minimum 12 pcs per model/colour)",
  city: "India",
};

export const waLink = (msg: string, number = SITE.whatsappRaw) =>
  `https://wa.me/${number.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}`;
