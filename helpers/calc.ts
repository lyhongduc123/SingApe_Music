import { MyTrack } from "@/types/zing.types";

export function getTotalDuration(items: MyTrack[]): number {
    return items.reduce((total, item) => total + (item.duration ?? 0), 0);
}