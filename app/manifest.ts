import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Роль музыки в становлении личности Абая",
    short_name: "Музыка и Абай",
    lang: "ru",
    start_url: "/",
    display: "standalone",
    background_color: "#eff1ec",
    theme_color: "#1f3d30",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  }
}
