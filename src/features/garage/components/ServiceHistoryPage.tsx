import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Search, Wrench } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";
import { SERVICE_TYPES } from "../constants";
import type { ServiceRecord } from "../../../types/serviceRecord";
import type { Vehicle } from "../../../types/vehicle";

type ServiceHistoryPageProps = {
  userId: string;
  vehicles: Vehicle[];
  refreshTrigger: number;
};

type SortOption =
  | "date_desc"
  | "date_asc"
  | "cost_desc"
  | "cost_asc"
  | "mileage_desc"
  | "mileage_asc";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatMileage(mileage: number | null) {
  if (mileage === null) {
    return "Mileage unavailable";
  }

  return `${new Intl.NumberFormat("en-US").format(mileage)} mi`;
}

function formatCurrency(cost: number | null) {
  if (cost === null) {
    return "Cost unavailable";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cost);
}

function getVehicleLabel(vehicle: Vehicle | undefined) {
  if (!vehicle) {
    return "Unknown vehicle";
  }

  return (
    vehicle.nickname ||
    [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
      .filter(Boolean)
      .join(" ") ||
    "Unnamed vehicle"
  );
}

function getServiceTypeClass(serviceType: string) {
  const type = serviceType.toLowerCase();

  if (type.includes("oil")) {
    return "border-orange-400/40 bg-orange-500/15 text-orange-300";
  }

  if (type.includes("tire")) {
    return "border-sky-400/40 bg-sky-500/15 text-sky-300";
  }

  if (type.includes("brake")) {
    return "border-red-400/40 bg-red-500/15 text-red-300";
  }

  if (type.includes("air")) {
    return "border-emerald-400/40 bg-emerald-500/15 text-emerald-300";
  }

  return "border-orange-400/40 bg-orange-500/15 text-orange-300";
}

export default function ServiceHistoryPage({
  userId,
  vehicles,
  refreshTrigger,
}: ServiceHistoryPageProps) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [query, setQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("date_desc");

  useEffect(() => {
    let ignore = false;

    const fetchRecords = async () => {
      setLoading(true);
      setErrorMsg("");

      const { data, error } = await supabase
        .from("service_records")
        .select("*")
        .eq("user_id", userId)
        .order("service_date", { ascending: false });

      if (ignore) {
        return;
      }

      if (error) {
        setErrorMsg(
          "We could not load your service history. Please try again.",
        );
        setLoading(false);
        return;
      }

      setRecords((data ?? []) as ServiceRecord[]);
      setLoading(false);
    };

    void fetchRecords();

    return () => {
      ignore = true;
    };
  }, [refreshTrigger, userId]);

  const vehicleById = useMemo(
    () => new Map(vehicles.map((vehicle) => [vehicle.id, vehicle])),
    [vehicles],
  );

  const displayedRecords = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return records
      .filter((record) => {
        const vehicle = vehicleById.get(record.vehicle_id);
        const vehicleLabel = getVehicleLabel(vehicle).toLowerCase();

        const matchesQuery =
          !normalizedQuery ||
          [
            record.service_type,
            record.notes,
            record.mileage?.toString(),
            vehicleLabel,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        const matchesVehicle =
          vehicleFilter === "all" || record.vehicle_id === vehicleFilter;

        const matchesType =
          typeFilter === "all" || record.service_type === typeFilter;

        return matchesQuery && matchesVehicle && matchesType;
      })
      .sort((first, second) => {
        switch (sortBy) {
          case "date_asc":
            return first.service_date.localeCompare(second.service_date);
          case "cost_desc":
            return (second.cost ?? 0) - (first.cost ?? 0);
          case "cost_asc":
            return (first.cost ?? 0) - (second.cost ?? 0);
          case "mileage_desc":
            return (second.mileage ?? 0) - (first.mileage ?? 0);
          case "mileage_asc":
            return (first.mileage ?? 0) - (second.mileage ?? 0);
          case "date_desc":
          default:
            return second.service_date.localeCompare(first.service_date);
        }
      });
  }, [query, records, sortBy, typeFilter, vehicleById, vehicleFilter]);

  if (loading) {
    return (
      <section
        aria-live="polite"
        aria-busy="true"
        className="rounded-xl border border-border bg-background px-6 py-12 text-center"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Loading service history
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Gathering maintenance activity across your garage.
        </p>
      </section>
    );
  }

  if (errorMsg) {
    return (
      <section
        role="alert"
        className="rounded-xl border border-danger/40 bg-danger/10 px-6 py-8 text-center"
      >
        <p className="text-sm font-bold text-danger">{errorMsg}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="border-b border-border pb-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Maintenance records
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Service History
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Review maintenance activity across your garage.
        </p>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <select
            value={vehicleFilter}
            onChange={(event) => setVehicleFilter(event.target.value)}
            aria-label="Filter service records by vehicle"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">All vehicles</option>
            {vehicles.map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {getVehicleLabel(vehicle)}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            aria-label="Filter service records by type"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">All services</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            aria-label="Sort service records"
            className="rounded-md border border-border bg-background px-3 py-2 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="date_desc">Newest first</option>
            <option value="date_asc">Oldest first</option>
            <option value="cost_desc">Cost: high to low</option>
            <option value="cost_asc">Cost: low to high</option>
            <option value="mileage_desc">Mileage: high to low</option>
            <option value="mileage_asc">Mileage: low to high</option>
          </select>
        </div>

        <label className="relative block w-full lg:max-w-sm">
          <span className="sr-only">Search service records</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search services, notes, or vehicles..."
            className="h-10 w-full rounded-md border border-border bg-background pl-10 pr-3 text-sm text-text placeholder:text-text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      {records.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-background px-6 py-14 text-center">
          <Wrench className="mx-auto h-9 w-9 text-accent" />
          <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            No maintenance records
          </p>
          <h2 className="mt-2 text-xl font-bold tracking-tight text-text">
            Your service history starts here
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
            Log service from the header to build a complete maintenance timeline
            for your vehicles.
          </p>
        </section>
      ) : displayedRecords.length === 0 ? (
        <section className="rounded-xl border border-dashed border-border bg-background px-6 py-14 text-center">
          <Search className="mx-auto h-8 w-8 text-text-muted" />
          <h2 className="mt-4 text-base font-bold text-text">
            No matching service records
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Try another vehicle, service type, or search term.
          </p>
        </section>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-background">
          <div className="overflow-x-auto">
            <table className="w-full min-w-200 border-collapse text-left">
              <thead className="bg-black/10">
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Date
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Vehicle
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Service
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Details
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Mileage
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Cost
                  </th>
                </tr>
              </thead>

              <tbody>
                {displayedRecords.map((record) => {
                  const vehicle = vehicleById.get(record.vehicle_id);

                  return (
                    <tr
                      key={record.id}
                      className="border-b border-border transition-colors last:border-b-0 hover:bg-accent/5"
                    >
                      <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-text">
                        <div className="inline-flex items-center gap-2">
                          <CalendarDays className="h-4 w-4 text-text-muted" />
                          {formatDate(record.service_date)}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-text">
                        {getVehicleLabel(vehicle)}
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getServiceTypeClass(
                            record.service_type,
                          )}`}
                        >
                          {record.service_type}
                        </span>
                      </td>

                      <td className="max-w-96 px-4 py-4 text-sm text-text-muted">
                        <span className="line-clamp-2">
                          {record.notes?.trim() || "No description added"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-sm text-text-muted">
                        {formatMileage(record.mileage)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-bold text-text">
                        {formatCurrency(record.cost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
