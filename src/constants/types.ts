import type { WINDOW_CONFIG } from "#constants";

export type FileItem = {
  id: number;
  name: string;
  icon: string;
  kind: "file" | "folder";
  fileType?: "txt" | "url" | "img" | "fig" | "pdf";
  position?: string;
  windowPosition?: string;
  href?: string;
  imageUrl?: string;
  description?: string[];
  subtitle?: string;
  image?: string;
  children?: FileItem[];
};

export type Location = {
  id: number;
  type: string;
  name: string;
  icon: string;
  kind: "folder";
  children: FileItem[];
};

export type WindowState = {
  isOpen: boolean;
  zIndex: number;
  data: FileItem | Location | null;
};

export type WindowKey = keyof typeof WINDOW_CONFIG;

export type WindowConfig = Record<WindowKey, WindowState>;

// DockApp
type DockAppId = Extract<
  WindowKey,
  "finder" | "safari" | "photos" | "contact" | "terminal" | "trash"
>;

export type DockApp = {
  id: DockAppId;
  name: string;
  icon: string;
  canOpen: boolean;
};

// NavLink

type NavLinkType = Extract<WindowKey, "finder" | "contact" | "resume">;

export type NavLink = {
  id: number;
  name: string;
  type: NavLinkType;
};
