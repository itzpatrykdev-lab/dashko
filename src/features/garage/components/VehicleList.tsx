import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

interface Vehicle {
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
}

const inputClass =
  "bg-background border border-border rounded px-3 py-2 text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent transition";

export default function VehicleList({
  vehicles,
  loading,
  onVehicleChanged,
}: {
  vehicles: Vehicle[];
  loading: boolean;
  onVehicleChanged: () => void;
  refreshTrigger: number;
}) {
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Vehicle>>({});

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Delete this vehicle? This cannot be undone.",
    );
    if (!confirmed) return;

    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      setErrorMsg(error.message);
    } else {
      onVehicleChanged();
    }
  };

  const startEdit = (v: Vehicle) => {
    setEditingId(v.id);
    setEditForm(v);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
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
    } else {
      onVehicleChanged();
      cancelEdit();
    }
  };

  if (loading) return <p className="text-text-muted">Loading vehicles...</p>;
  if (errorMsg) return <p className="text-danger">{errorMsg}</p>;
  if (vehicles.length === 0)
    return <p className="text-text-muted">No vehicles yet. Add one above.</p>;

  return (
    <div>
      <h3 className="text-lg font-semibold text-text mb-4">Your Vehicles</h3>
      <div className="flex flex-col gap-4">
        {vehicles.map((v) =>
          editingId === v.id ? (
            <div
              key={v.id}
              className="bg-surface border border-accent rounded-lg p-4 flex flex-col gap-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  className={inputClass}
                  placeholder="Nickname"
                  value={editForm.nickname || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, nickname: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Make"
                  value={editForm.make || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, make: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Model"
                  value={editForm.model || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, model: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Year"
                  type="number"
                  value={editForm.year ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      year: parseInt(e.target.value) || null,
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Current Mileage"
                  type="number"
                  value={editForm.current_mileage ?? ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      current_mileage: parseInt(e.target.value) || null,
                    })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="VIN"
                  value={editForm.vin || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, vin: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Trim"
                  value={editForm.trim || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, trim: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="License Plate"
                  value={editForm.license_plate || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, license_plate: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Plate State"
                  value={editForm.plate_state || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, plate_state: e.target.value })
                  }
                />
                <label className="flex flex-col gap-1 text-sm text-text-muted">
                  Plate Expiration
                  <input
                    className={inputClass}
                    type="date"
                    value={editForm.plate_expiration || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        plate_expiration: e.target.value,
                      })
                    }
                  />
                </label>
                <input
                  className={inputClass}
                  placeholder="Paint Code"
                  value={editForm.paint_code || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, paint_code: e.target.value })
                  }
                />
                <input
                  className={inputClass}
                  placeholder="Interior Color"
                  value={editForm.interior_color || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, interior_color: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => saveEdit(v.id)}
                  className="bg-accent text-white px-4 py-2 rounded font-medium hover:opacity-90 transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="border border-border text-text-muted px-4 py-2 rounded hover:text-text transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={v.id}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <strong className="text-accent text-lg">
                {v.nickname || `${v.year} ${v.make} ${v.model}`}
              </strong>
              <p className="text-text">
                {v.year} {v.make} {v.model} {v.trim}
              </p>
              <p className="text-text-muted text-sm">VIN: {v.vin || "N/A"}</p>
              <p className="text-text-muted text-sm">
                Plate: {v.license_plate || "N/A"} ({v.plate_state || "N/A"})
              </p>
              <p className="text-text-muted text-sm">
                Plate Expires: {v.plate_expiration || "N/A"}
              </p>
              <p className="text-text-muted text-sm">
                Mileage: {v.current_mileage ?? "N/A"}
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => startEdit(v)}
                  className="border border-border text-text px-3 py-1.5 rounded hover:border-accent hover:text-accent transition text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="border border-danger text-danger px-3 py-1.5 rounded hover:bg-danger hover:text-white transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
