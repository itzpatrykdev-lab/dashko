import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { SERVICE_TYPES } from "../constants";
import { inputClass } from "../../../styles";

interface VehicleOption {
  id: string;
  nickname: string | null;
  make: string | null;
  model: string | null;
  year: number | null;
}

export default function AddServiceRecord({
  session,
  vehicles,
  onRecordAdded,
}: {
  session: Session;
  vehicles: VehicleOption[];
  onRecordAdded: () => void;
}) {
  const [vehicleId, setVehicleId] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [mileage, setMileage] = useState("");
  const [cost, setCost] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [otherDescription, setOtherDescription] = useState("");

  const resetForm = () => {
    setVehicleId("");
    setServiceDate("");
    setServiceType("");
    setMileage("");
    setCost("");
    setNotes("");
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setOtherDescription("");

    if (!vehicleId) {
      setErrorMsg("Please select a vehicle");
      return;
    }

    const finalServiceType =
      serviceType === "Other" && otherDescription
        ? otherDescription
        : serviceType;

    const { error } = await supabase.from("service_records").insert({
      vehicle_id: vehicleId,
      user_id: session.user.id,
      service_date: serviceDate,
      service_type: finalServiceType,
      mileage: mileage ? parseInt(mileage) : null,
      cost: cost ? parseFloat(cost) : null,
      notes,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Service record added!");
      resetForm();
      onRecordAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-text">Log a Service</h3>

      <select
        className={inputClass}
        value={vehicleId}
        onChange={(e) => setVehicleId(e.target.value)}
      >
        <option value="">Select a vehicle</option>
        {vehicles.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nickname || `${v.year} ${v.make} ${v.model}`}
          </option>
        ))}
      </select>

      <label className="flex flex-col gap-1 text-sm text-text-muted">
        Service Date
        <input
          className={inputClass}
          type="date"
          value={serviceDate}
          onChange={(e) => setServiceDate(e.target.value)}
        />
      </label>

      <select
        className={inputClass}
        value={serviceType}
        onChange={(e) => setServiceType(e.target.value)}
      >
        <option value="">Select service type</option>
        {SERVICE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {serviceType === "Other" && (
        <input
          className={inputClass}
          placeholder="Describe the service"
          value={otherDescription}
          onChange={(e) => setOtherDescription(e.target.value)}
        />
      )}

      <input
        className={inputClass}
        placeholder="Mileage"
        type="number"
        value={mileage}
        onChange={(e) => setMileage(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Cost"
        type="number"
        step="0.01"
        value={cost}
        onChange={(e) => setCost(e.target.value)}
      />
      <textarea
        className={`${inputClass} min-h-20 resize-none`}
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button
        type="submit"
        className="bg-accent text-white px-4 py-2.5 rounded font-medium hover:opacity-90 transition mt-1"
      >
        Add Service Record
      </button>

      {errorMsg && <p className="text-danger text-sm">{errorMsg}</p>}
      {successMsg && <p className="text-success text-sm">{successMsg}</p>}
    </form>
  );
}
