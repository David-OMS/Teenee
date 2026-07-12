export const theme = {
  accent: "#FA114F",
  dark: {
    canvas: "#000000",
    card: "#1C1C1E",
    textPrimary: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.6)",
    accentDim: "rgba(250,17,79,0.15)",
  },
  light: {
    canvas: "#FFFFFF",
    surface: "#F5F5F7",
    textPrimary: "#000000",
    textMuted: "rgba(0,0,0,0.5)",
    border: "rgba(0,0,0,0.08)",
  },
} as const;

export type Surface = "light" | "dark";
