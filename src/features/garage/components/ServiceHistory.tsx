import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { SERVICE_TYPES } from "../constants";
import { inputClass, selectClass } from "../../../styles";

interface ServiceRecord {
  id: string;
  service_date: string;
  service_type: string;
  mileage: number | null;
  cost: number | null;
  notes: string | null;
}

export default function ServiceHistory({
  vehicleId,
  refreshTrigger,
}: {
  vehicleId: string;
  refreshTrigger: number;
}) {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    service_date: "",
    service_type: "",
    mileage: "",
    cost: "",
    notes: "",
  });
  const [sortBy, setSortBy] = useState("date_desc");
  const [filterType, setFilterType] = useState("All");

  const fetchRecords = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_records")
      .select("*")
      .eq("vehicle_id", vehicleId)
      .order("service_date", { ascending: false });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setRecords(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, [vehicleId, refreshTrigger]);

  const startEdit = (r: ServiceRecord) => {
    setEditingId(r.id);
    setEditForm({
      service_date: r.service_date,
      service_type: r.service_type,
      mileage: r.mileage != null ? String(r.mileage) : "",
      cost: r.cost != null ? String(r.cost) : "",
      notes: r.notes ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from("service_records")
      .update({
        service_date: editForm.service_date,
        service_type: editForm.service_type,
        mileage: editForm.mileage ? Number(editForm.mileage) : null,
        cost: editForm.cost ? Number(editForm.cost) : null,
        notes: editForm.notes || null,
      })
      .eq("id", id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    setEditingId(null);
    fetchRecords();
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this service record? This cannot be undone.",
    );
    if (!confirmed) return;

    const { error } = await supabase
      .from("service_records")
      .delete()
      .eq("id", id);

    if (error) {
      setErrorMsg(error.message);
      return;
    }
    fetchRecords();
  };

  const getDisplayedRecords = () => {
    let result = [...records];

    if (filterType !== "All") {
      if (filterType === "Other") {
        result = result.filter(
          (r) =>
            !SERVICE_TYPES.includes(r.service_type) ||
            r.service_type === "Other",
        );
      } else {
        result = result.filter((r) => r.service_type === filterType);
      }
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":
          return a.service_date.localeCompare(b.service_date);
        case "date_desc":
          return b.service_date.localeCompare(a.service_date);
        case "cost_asc":
          return (a.cost ?? 0) - (b.cost ?? 0);
        case "cost_desc":
          return (b.cost ?? 0) - (a.cost ?? 0);
        case "mileage_asc":
          return (a.mileage ?? 0) - (b.mileage ?? 0);
        case "mileage_desc":
          return (b.mileage ?? 0) - (a.mileage ?? 0);
        default:
          return 0;
      }
    });

    return result;
  };

  const displayedRecords = getDisplayedRecords();

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  };

  const formatMileage = (mileage: number | null) => {
    if (mileage === null) return "—";

    return `${new Intl.NumberFormat("en-US").format(mileage)} mi`;
  };

  const formatCurrency = (cost: number | null) => {
    if (cost === null) return "—";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cost);
  };

  const getServiceTypeClass = (serviceType: string) => {
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

    if (type.includes("fuel")) {
      return "border-violet-400/40 bg-violet-500/15 text-violet-300";
    }

    return "border-orange-400/40 bg-orange-500/15 text-orange-300";
  };

  if (loading)
    return (
      <p className="text-text-muted text-sm mt-3">Loading service history...</p>
    );
  if (errorMsg) return <p className="text-danger text-sm mt-3">{errorMsg}</p>;

  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-border bg-background">
      <div className="flex flex-col gap-4 border-b border-border px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            Maintenance records
          </p>

          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-text">
            Service History
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            className={selectClass}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filter service history by type"
          >
            <option value="All">All Types</option>
            {SERVICE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className={selectClass}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort service history"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="cost_desc">Cost: High to Low</option>
            <option value="cost_asc">Cost: Low to High</option>
            <option value="mileage_desc">Mileage: High to Low</option>
            <option value="mileage_asc">Mileage: Low to High</option>
          </select>
        </div>
      </div>

      {displayedRecords.length === 0 ? (
        <p className="px-5 py-8 text-sm text-text-muted">
          No service records match this filter.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-220 border-collapse text-left">
            <thead className="bg-black/10">
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted sm:px-5">
                  Date
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Mileage
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Service type
                </th>
                <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  Cost
                </th>
                <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-text-muted sm:px-5">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {displayedRecords.map((r) =>
                editingId === r.id ? (
                  <tr key={r.id} className="border-b border-border bg-accent/5">
                    <td colSpan={6} className="p-4 sm:p-5">
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <input
                          className={inputClass}
                          type="date"
                          value={editForm.service_date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              service_date: e.target.value,
                            })
                          }
                          aria-label="Service date"
                        />

                        <select
                          className={selectClass}
                          value={editForm.service_type}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              service_type: e.target.value,
                            })
                          }
                          aria-label="Service type"
                        >
                          {SERVICE_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>

                        <input
                          className={inputClass}
                          type="number"
                          value={editForm.mileage}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              mileage: e.target.value,
                            })
                          }
                          placeholder="Mileage"
                          aria-label="Mileage"
                        />

                        <input
                          className={inputClass}
                          type="number"
                          value={editForm.cost}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              cost: e.target.value,
                            })
                          }
                          placeholder="Cost"
                          aria-label="Cost"
                        />

                        <input
                          className={inputClass}
                          type="text"
                          value={editForm.notes}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              notes: e.target.value,
                            })
                          }
                          placeholder="Description or notes"
                          aria-label="Description or notes"
                        />
                      </div>

                      <div className="mt-3 flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdate(r.id)}
                          className="rounded bg-accent px-3 py-1.5 text-sm font-semibold text-white transition hover:opacity-90"
                        >
                          Save changes
                        </button>

                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded border border-border px-3 py-1.5 text-sm font-medium text-text-muted transition hover:border-accent hover:text-text"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={r.id}
                    className="border-b border-border transition-colors last:border-b-0 hover:bg-accent/5"
                  >
                    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-text sm:px-5">
                      {formatDate(r.service_date)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-text-muted">
                      {formatMileage(r.mileage)}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getServiceTypeClass(
                          r.service_type,
                        )}`}
                      >
                        {r.service_type}
                      </span>
                    </td>

                    <td className="max-w-85 px-4 py-4 text-sm text-text-muted">
                      <span className="line-clamp-2">
                        {r.notes?.trim() || "No description added"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold text-text">
                      {formatCurrency(r.cost)}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right sm:px-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(r)}
                          className="rounded border border-border px-2.5 py-1 text-xs font-medium text-text transition hover:border-accent hover:text-accent"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(r.id)}
                          className="rounded border border-danger px-2.5 py-1 text-xs font-medium text-danger transition hover:bg-danger hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
