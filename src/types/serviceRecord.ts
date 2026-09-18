export type ServiceRecord = {
  id: string;
  user_id: string;
  vehicle_id: string;
  service_date: string;
  service_type: string;
  mileage: number | null;
  cost: number | null;
  notes: string | null;
  created_at: string;
};