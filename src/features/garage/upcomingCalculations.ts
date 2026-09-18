import { DEFAULT_SERVICE_INTERVALS } from "./constants";

interface ServiceRecord {
  service_date: string;
  service_type: string;
  mileage: number | null;
}

export interface UpcomingItem {
  type: string;
  milesLeft: number | null;
  dueDate: string | null;
}

export function getUpcomingMaintenance(
  records: ServiceRecord[],
  currentMileage: number | null,
): UpcomingItem[] {
  const upcoming: UpcomingItem[] = [];

  for (const interval of DEFAULT_SERVICE_INTERVALS) {
    const matching = records
      .filter((r) => r.service_type === interval.type)
      .sort((a, b) => b.service_date.localeCompare(a.service_date));

    const lastService = matching[0];
    if (!lastService) continue;

    let milesLeft: number | null = null;
    if (
      interval.mileageInterval &&
      lastService.mileage != null &&
      currentMileage != null
    ) {
      const dueAtMileage = lastService.mileage + interval.mileageInterval;
      milesLeft = dueAtMileage - currentMileage;
    }

    let dueDate: string | null = null;
    if (interval.monthsInterval) {
      const last = new Date(lastService.service_date);
      last.setMonth(last.getMonth() + interval.monthsInterval);
      dueDate = last.toISOString().split("T")[0];
    }

    if (milesLeft != null || dueDate != null) {
      upcoming.push({ type: interval.type, milesLeft, dueDate });
    }
  }

  return upcoming.sort((a, b) => (a.milesLeft ?? Infinity) - (b.milesLeft ?? Infinity));
}