import { useMemo, useState } from "react";
import { Car, Plus, Search } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import type { Vehicle } from "../../../types/vehicle";
import VehicleCard from "./VehicleCard";

type VehicleListProps = {
  vehicles: Vehicle[];
  loading: boolean;
  onVehicleChanged: () => void;
  onAddVehicle: () => void;
  activeVehicleId: string;
};

type VehicleFilter = "all" | "attention";

const inputClass =
  "rounded-md border border-border bg-background px-3 py-2 text-text placeholder:text-text-muted transition focus:outline-none focus:ring-2 focus:ring-accent";

function getVehicleSearchText(vehicle: Vehicle) {
  return [
    vehicle.nickname,
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.trim,
    vehicle.vin,
    vehicle.license_plate,
    vehicle.plate_state,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function VehicleList({
  vehicles,
  loading,
  onVehicleChanged,
  onAddVehicle,
  activeVehicleId,
}: VehicleListProps) {
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<VehicleFilter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Vehicle>>({});

  const filteredVehicles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !query || getVehicleSearchText(vehicle).includes(query);

      // Keep the filter in the UI, but do not invent maintenance data.
      const matchesFilter = activeFilter === "all";

      return matchesSearch && matchesFilter;
    });
  }, [activeFilter, searchQuery, vehicles]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this vehicle? This cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setErrorMsg("");

    const { error } = await supabase.from("vehicles").delete().eq("id", id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    onVehicleChanged();
  };

  const startEdit = (vehicle: Vehicle) => {
    setErrorMsg("");
    setEditingId(vehicle.id);
    setEditForm(vehicle);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setErrorMsg("");

    const { error } = await supabase
      .from("vehicles")
      .update({
        vin: editForm.vin,
        make: editForm.make,
        model: editForm.model,
        year: editForm.year,
        trim: editForm.trim,
        nickname: editForm.nickname,
        license_plate: editForm.license_plate,
        plate_state: editForm.plate_state,
        plate_expiration: editForm.plate_expiration,
        paint_code: editForm.paint_code,
        interior_color: editForm.interior_color,
        current_mileage: editForm.current_mileage,
      })
      .eq("id", id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    onVehicleChanged();
    cancelEdit();
  };

  if (loading) {
    return (
      <section
        aria-live="polite"
        aria-busy="true"
        className="rounded-xl border border-border bg-background px-6 py-12 text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Loading garage
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Getting your vehicles ready.
        </p>
      </section>
    );
  }

  if (vehicles.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-border bg-background px-6 py-14 text-center">
        <Car className="mx-auto h-9 w-9 text-accent" />
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Your garage is empty
        </p>
        <h1 className="mt-2 text-xl font-bold tracking-tight text-text">
          Add your first vehicle
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
          Add a vehicle to begin tracking its service history and ownership
          details.
        </p>
        <button
          type="button"
          onClick={onAddVehicle}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add vehicle
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="border-b border-border pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Garage
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Your Vehicles
        </h1>

        <p className="mt-1 text-sm text-text-muted">
          {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}{" "}
          tracked
          {" · "}Manage your complete garage.
        </p>
      </header>

      {errorMsg && (
        <p
          role="alert"
          className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {errorMsg}
        </p>
      )}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={[
              "rounded-md border px-3 py-2 text-xs font-bold transition",
              activeFilter === "all"
                ? "border-accent bg-accent/10 text-accent"
                : "border-border text-text-muted hover:border-accent/60 hover:text-text",
            ].join(" ")}
          >
            All vehicles{" "}
            <span className="ml-1 opacity-70">{vehicles.length}</span>
          </button>

          <button
            type="button"
            disabled
            title="Maintenance status filters are coming soon"
            className="cursor-not-allowed rounded-md border border-border px-3 py-2 text-xs font-bold text-text-muted/50"
          >
            Needs attention <span className="ml-1 opacity-70">Soon</span>
          </button>
        </div>

        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">Search vehicles</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search vehicles, VIN, or plate..."
            className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      {filteredVehicles.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-background px-6 py-14 text-center">
          <Search className="mx-auto h-8 w-8 text-text-muted" />
          <h2 className="mt-4 text-base font-bold text-text">
            No matching vehicles
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Try searching by vehicle name, VIN, license plate, or state.
          </p>
        </section>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredVehicles.map((vehicle) =>
            editingId === vehicle.id ? (
              <VehicleEditCard
                key={vehicle.id}
                vehicle={vehicle}
                form={editForm}
                onChange={setEditForm}
                onSave={() => saveEdit(vehicle.id)}
                onCancel={cancelEdit}
              />
            ) : (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isActive={vehicle.id === activeVehicleId}
                onEdit={startEdit}
                onDelete={handleDelete}
              />
            ),
          )}
        </div>
      )}
    </section>
  );
}

type VehicleEditCardProps = {
  vehicle: Vehicle;
  form: Partial<Vehicle>;
  onChange: (form: Partial<Vehicle>) => void;
  onSave: () => void;
  onCancel: () => void;
};

function VehicleEditCard({
  vehicle,
  form,
  onChange,
  onSave,
  onCancel,
}: VehicleEditCardProps) {
  const updateField = <Key extends keyof Vehicle>(
    field: Key,
    value: Vehicle[Key],
  ) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <article className="rounded-xl border border-accent bg-surface p-5">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
        Editing vehicle
      </p>
      <h2 className="mt-2 text-lg font-bold text-text">
        {vehicle.nickname || "Vehicle details"}
      </h2>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Nickname"
          value={form.nickname ?? ""}
          onChange={(event) => updateField("nickname", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Make"
          value={form.make ?? ""}
          onChange={(event) => updateField("make", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Model"
          value={form.model ?? ""}
          onChange={(event) => updateField("model", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Year"
          type="number"
          value={form.year ?? ""}
          onChange={(event) =>
            updateField(
              "year",
              event.target.value
                ? Number.parseInt(event.target.value, 10)
                : null,
            )
          }
        />
        <input
          className={inputClass}
          placeholder="Current mileage"
          type="number"
          value={form.current_mileage ?? ""}
          onChange={(event) =>
            updateField(
              "current_mileage",
              event.target.value
                ? Number.parseInt(event.target.value, 10)
                : null,
            )
          }
        />
        <input
          className={inputClass}
          placeholder="VIN"
          value={form.vin ?? ""}
          onChange={(event) => updateField("vin", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Trim"
          value={form.trim ?? ""}
          onChange={(event) => updateField("trim", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="License plate"
          value={form.license_plate ?? ""}
          onChange={(event) => updateField("license_plate", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Plate state"
          value={form.plate_state ?? ""}
          onChange={(event) => updateField("plate_state", event.target.value)}
        />
        <label className="flex flex-col gap-1 text-xs font-medium text-text-muted">
          Plate expiration
          <input
            className={inputClass}
            type="date"
            value={form.plate_expiration ?? ""}
            onChange={(event) =>
              updateField("plate_expiration", event.target.value || null)
            }
          />
        </label>
        <input
          className={inputClass}
          placeholder="Paint code"
          value={form.paint_code ?? ""}
          onChange={(event) => updateField("paint_code", event.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Interior color"
          value={form.interior_color ?? ""}
          onChange={(event) =>
            updateField("interior_color", event.target.value)
          }
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSave}
          className="rounded-md bg-accent px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-border px-4 py-2 text-sm font-bold text-text-muted transition hover:border-accent hover:text-text"
        >
          Cancel
        </button>
      </div>
    </article>
  );
}
