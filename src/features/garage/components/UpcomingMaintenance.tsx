import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { eyebrowClass } from "../../../styles";
import {
  getUpcomingMaintenance,
  type UpcomingItem,
} from "../upcomingCalculations";

export default function UpcomingMaintenance({
  vehicleId,
  currentMileage,
}: {
  vehicleId: string;
  currentMileage: number | null;
}) {
  const [items, setItems] = useState<UpcomingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndCalculate = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("service_records")
        .select("service_date, service_type, mileage")
        .eq("vehicle_id", vehicleId);

      if (!error && data) {
        setItems(getUpcomingMaintenance(data, currentMileage));
      }
      setLoading(false);
    };

    fetchAndCalculate();
  }, [vehicleId, currentMileage]);

  if (loading) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className={eyebrowClass}>Plan Ahead</p>
      <h3 className="font-display text-text text-lg uppercase mb-3">
        Upcoming Maintenance
      </h3>

      {items.length === 0 ? (
        <p className="text-text-muted text-sm">
          Log a service to start tracking upcoming maintenance.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.type}
              className="flex justify-between items-center py-2"
            >
              <div>
                <p className="text-text text-sm font-medium">{item.type}</p>
                {item.dueDate && (
                  <p className="text-text-muted text-xs">Due {item.dueDate}</p>
                )}
              </div>
              {item.milesLeft != null && (
                <span
                  className={`text-sm font-semibold ${
                    item.milesLeft < 500 ? "text-danger" : "text-success"
                  }`}
                >
                  {item.milesLeft > 0
                    ? `${item.milesLeft.toLocaleString()} mi left`
                    : "Overdue"}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
