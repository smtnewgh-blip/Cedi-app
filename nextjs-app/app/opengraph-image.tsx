import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() { return new ImageResponse(<div style={{ background: "#185c3a", color: "#fff9e8", height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px", fontFamily: "sans-serif" }}><div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>₵ CediApp</div><div style={{ display: "flex", fontSize: 76, fontWeight: 700, marginTop: 44 }}>Explore with confidence.</div><div style={{ display: "flex", fontSize: 30, marginTop: 24, color: "#d9f3df" }}>A guided experience for digital-finance concepts.</div></div>, size); }
