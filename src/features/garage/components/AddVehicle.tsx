import { useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";
import { inputClass } from "../../../styles";

export default function AddVehicle({
  session,
  onVehicleAdded,
}: {
  session: Session;
  onVehicleAdded: () => void;
}) {
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [trim, setTrim] = useState("");
  const [nickname, setNickname] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [plateState, setPlateState] = useState("");
  const [plateExpiration, setPlateExpiration] = useState("");
  const [paintCode, setPaintCode] = useState("");
  const [interiorColor, setInteriorColor] = useState("");
  const [currentMileage, setCurrentMileage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const resetForm = () => {
    setVin("");
    setMake("");
    setModel("");
    setYear("");
    setTrim("");
    setNickname("");
    setLicensePlate("");
    setPlateState("");
    setPlateExpiration("");
    setPaintCode("");
    setInteriorColor("");
    setCurrentMileage("");
  };

  const [decoding, setDecoding] = useState(false);

  const handleDecodeVin = async () => {
    if (vin.length !== 17) {
      setErrorMsg("VIN must be 17 characters");
      return;
    }
    setDecoding(true);
    setErrorMsg("");

    try {
      const response = await fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`,
      );
      const data = await response.json();
      const results = data.Results;

      const getValue = (variableName: string) =>
        results.find(
          (r: { Variable: string; Value: string | null }) =>
            r.Variable === variableName,
        )?.Value || "";

      setMake(getValue("Make"));
      setModel(getValue("Model"));
      setYear(getValue("Model Year"));
      setTrim(getValue("Trim"));
    } catch {
      setErrorMsg("Could not decode VIN. Check your connection and try again.");
    } finally {
      setDecoding(false);
    }
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const { error } = await supabase.from("vehicles").insert({
      user_id: session.user.id,
      vin,
      make,
      model,
      year: year ? parseInt(year) : null,
      trim,
      nickname,
      license_plate: licensePlate,
      plate_state: plateState,
      plate_expiration: plateExpiration || null,
      paint_code: paintCode,
      interior_color: interiorColor,
      current_mileage: currentMileage ? parseInt(currentMileage) : null,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg("Vehicle added!");
      resetForm();
      onVehicleAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-text">Add a Vehicle</h3>

      <div className="flex gap-2">
        <input
          className={inputClass}
          placeholder="VIN"
          value={vin}
          onChange={(e) => setVin(e.target.value)}
        />
        <button
          type="button"
          onClick={handleDecodeVin}
          disabled={decoding}
          className="bg-accent text-white px-4 py-2 rounded font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {decoding ? "Decoding..." : "Decode VIN"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <input
          className={inputClass}
          placeholder="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Trim"
          value={trim}
          onChange={(e) => setTrim(e.target.value)}
        />
        <input
          className={`${inputClass} col-span-2`}
          placeholder="Nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="License Plate"
          value={licensePlate}
          onChange={(e) => setLicensePlate(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Plate State"
          value={plateState}
          onChange={(e) => setPlateState(e.target.value)}
        />

        <label className="flex flex-col gap-1 text-sm text-text-muted col-span-2">
          Plate Expiration
          <input
            className={inputClass}
            type="date"
            value={plateExpiration}
            onChange={(e) => setPlateExpiration(e.target.value)}
          />
        </label>

        <input
          className={inputClass}
          placeholder="Paint Code"
          value={paintCode}
          onChange={(e) => setPaintCode(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Interior Color"
          value={interiorColor}
          onChange={(e) => setInteriorColor(e.target.value)}
        />
        <input
          className={`${inputClass} col-span-2`}
          placeholder="Current Mileage"
          value={currentMileage}
          onChange={(e) => setCurrentMileage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="bg-accent text-white px-4 py-2.5 rounded font-medium hover:opacity-90 transition mt-1"
      >
        Add Vehicle
      </button>

      {errorMsg && <p className="text-danger text-sm">{errorMsg}</p>}
      {successMsg && <p className="text-success text-sm">{successMsg}</p>}
    </form>
  );
}
