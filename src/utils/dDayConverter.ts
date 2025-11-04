// Helper function to convert dDay string to number for JobInfoCard compatibility
export function convertDDayToNumber(
  dDay: string | number | null
): number | null {
  if (dDay === null || dDay === undefined) return null;
  if (typeof dDay === "number") return dDay;
  if (typeof dDay === "string") {
    if (dDay === "상시" || dDay === "신규" || dDay === "마감") return null;
    // Extract number from "D-5" format
    const match = dDay.match(/D-?(\d+)/);
    if (match) return parseInt(match[1]);
    // Try to parse as number directly
    const parsed = parseInt(dDay);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}
