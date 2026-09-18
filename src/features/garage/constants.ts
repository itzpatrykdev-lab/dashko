export const SERVICE_TYPES = [
  "Oil Change",
  "Tire Rotation",
  "Brake Service",
  "Battery Replacement",
  "Inspection",
  "Other",
];

export interface ServiceInterval {
  type: string;
  mileageInterval: number | null;
  monthsInterval: number | null;
}

export const DEFAULT_SERVICE_INTERVALS: ServiceInterval[] = [
  { type: "Oil Change", mileageInterval: 5000, monthsInterval: 6 },
  { type: "Tire Rotation", mileageInterval: 6000, monthsInterval: null },
  { type: "Brake Service", mileageInterval: 25000, monthsInterval: null },
  { type: "Battery Replacement", mileageInterval: null, monthsInterval: 48 },
  { type: "Inspection", mileageInterval: null, monthsInterval: 12 },
];