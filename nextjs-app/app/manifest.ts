import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CediApp",
    short_name: "CediApp",
    description: "A guided CediApp experience for exploring digital-finance concepts.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#185c3a",
  };
}
