import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Vehicle } from "../../../types/vehicle";

type VehicleCardProps = {
  vehicle: Vehicle;
  isActive?: boolean;
  onEdit: (vehicle: Vehicle) => void;
  onDelete: (vehicleId: string) => void;
};

function formatMileage(mileage: number | null) {
  if (mileage === null) {
    return "Mileage unavailable";
  }

  return `${new Intl.NumberFormat("en-US").format(mileage)} mi`;
}

function formatVehicleName(vehicle: Vehicle) {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .filter(Boolean)
    .join(" ");
}

function maskVin(vin: string | null) {
  if (!vin) {
    return "VIN unavailable";
  }

  if (vin.length <= 4) {
    return `VIN ${vin}`;
  }

  return `VIN ••••${vin.slice(-4)}`;
}

export default function VehicleCard({
  vehicle,
  isActive = false,
  onEdit,
  onDelete,
}: VehicleCardProps) {
  const vehicleName = formatVehicleName(vehicle);
  const vehicleLabel = vehicle.nickname || vehicleName || "Unnamed vehicle";
  const plate = [vehicle.license_plate, vehicle.plate_state]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-surface p-5 transition-colors hover:border-accent/50">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              {vehicle.nickname || "Vehicle"}
            </p>

            {isActive && (
              <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-accent">
                Active
              </span>
            )}
          </div>

          <h2 className="mt-2 truncate text-lg font-bold tracking-tight text-text">
            {vehicleName || "Vehicle details unavailable"}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onEdit(vehicle)}
          aria-label={`Edit ${vehicleLabel}`}
          title={`Edit ${vehicleLabel}`}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-text-muted transition hover:border-accent hover:text-accent"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-y border-border py-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Mileage
          </p>
          <p className="mt-1 text-sm font-semibold text-text">
            {formatMileage(vehicle.current_mileage)}
          </p>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
            Plate
          </p>
          <p className="mt-1 truncate text-sm font-semibold text-text">
            {plate || "Not recorded"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="truncate text-xs text-text-muted">
          {maskVin(vehicle.vin)}
        </p>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(vehicle)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-bold text-text transition hover:border-accent hover:text-accent"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(vehicle.id)}
            aria-label={`Delete ${vehicleLabel}`}
            title={`Delete ${vehicleLabel}`}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-danger/60 text-danger transition hover:bg-danger hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <MoreHorizontal
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 text-accent/[0.035]"
      />
    </article>
  );
}
