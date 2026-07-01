// Allow importing PDF (and other doc) assets from src/assets as URL strings.
declare module "*.pdf" {
  const src: string;
  export default src;
}
