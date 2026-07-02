import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { saveAs } from "file-saver";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fmt = (n: number): string => {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
    if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
    return String(n);
};

export const formatDuration = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days} day${days > 1 ? "s" : ""}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    return "Less than a minute";
  };


export const handleDownload = async (mediaUrl: string, filename: string) => {
  const res = await axios.get(mediaUrl, { responseType: "blob" });

  if (res.status !== 200) throw new Error("Download failed");

  saveAs(res.data, filename);
};
