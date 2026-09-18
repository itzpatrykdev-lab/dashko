import {
  CarFront,
  ClipboardList,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
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

function formatPlate(vehicle: Vehicle) {
  return [vehicle.license_plate, vehicle.plate_state]
    .filter(Boolean)
    .join(" · ");
}

export default function VehicleCard({
  vehicle,
  isActive = false,
  onEdit,
  onDelete,
}: VehicleCardProps) {
  const vehicleName = formatVehicleName(vehicle);
  const vehicleLabel = vehicle.nickname || vehicleName || "Unnamed vehicle";
  const plate = formatPlate(vehicle);

  return (
    <article className="group rounded-xl border border-border bg-surface p-5 shadow-sm transition duration-200 hover:border-accent/40 hover:bg-surface/90">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              {vehicle.nickname || "Vehicle"}
            </p>

            {isActive && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active
              </span>
            )}
          </div>

          <h2 className="mt-2 max-w-md text-lg font-bold leading-snug tracking-tight text-text">
            {vehicleName || "Vehicle details unavailable"}
          </h2>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-text-muted">
        <div className="inline-flex items-center gap-2">
          <CarFront className="h-4 w-4 text-text-muted" />
          <span className="font-medium text-text">
            {formatMileage(vehicle.current_mileage)}
          </span>
        </div>

        <span
          aria-hidden="true"
          className="hidden h-4 w-px bg-border sm:block"
        />

        <div className="inline-flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-text-muted" />
          <span className="font-medium text-text">
            {plate || "Plate not recorded"}
          </span>
        </div>
      </div>

      <p className="mt-4 text-sm text-text-muted">
        Service history available from your garage.
      </p>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onEdit(vehicle)}
          className="inline-flex items-center gap-2 rounded-md border border-accent px-3.5 py-2 text-xs font-bold text-text transition hover:bg-accent hover:text-white"
        >
          <Pencil className="h-3.5 w-3.5" />
          View details
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(vehicle)}
            aria-label={`Edit ${vehicleLabel}`}
            title={`Edit ${vehicleLabel}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-text-muted transition hover:border-accent hover:text-accent"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(vehicle.id)}
            aria-label={`Delete ${vehicleLabel}`}
            title={`Delete ${vehicleLabel}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-danger/50 text-danger transition hover:bg-danger hover:text-white"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
