import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/data";

export const runtime = "nodejs";
export const alt = "Portfolio — Mouhamed Rassoul Niang";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  let name = "Mouhamed Rassoul Niang";
  let title = "Développeur Full-Stack";
  try {
    const profile = await getProfile();
    if (profile) {
      name = profile.full_name;
      title = profile.title;
    }
  } catch {
    // valeurs par défaut
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          background: "#3a3f47",
          padding: "80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 96,
            height: 96,
            borderRadius: 999,
            background: "#ffffff",
            color: "#3a3f47",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          MN
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>{name}</div>
        <div style={{ fontSize: 36, marginTop: 16, color: "#c7ccd4" }}>{title}</div>
      </div>
    ),
    { ...size },
  );
}
