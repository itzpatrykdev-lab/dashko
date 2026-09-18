export interface Vehicle {
  id: string;
  vin: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
  trim: string | null;
  nickname: string | null;
  license_plate: string | null;
  plate_state: string | null;
  plate_expiration: string | null;
  paint_code: string | null;
  interior_color: string | null;
  current_mileage: number | null;
  image_url: string | null;
}

export function getVehicleLabel(vehicle: Vehicle): string {
  const nickname = vehicle.nickname?.trim();

  if (nickname) {
    return nickname;
  }

  const vehicleName = [vehicle.year, vehicle.make, vehicle.model]
    .filter(Boolean)
    .join(" ");

  return vehicleName || "Unnamed Vehicle";
}