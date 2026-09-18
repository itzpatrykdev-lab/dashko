import { ClipboardList, DollarSign, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { eyebrowClass } from "../../../styles";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

type VehicleStatsProps = {
  vehicleId: string;
};

type StatCardProps = {
  label: string;
  value: string;
  icon: typeof DollarSign;
  detail: string;
};

function StatCard({ label, value, icon: Icon, detail }: StatCardProps) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={eyebrowClass}>{label}</p>

          <p className="mt-2 font-display text-2xl text-text sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
            {detail}
          </p>
        </div>

        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
          <Icon size={20} strokeWidth={2.4} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function VehicleStats({ vehicleId }: VehicleStatsProps) {
  const [totalCost, setTotalCost] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchStats = async () => {
      setLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from("service_records")
        .select("cost")
        .eq("vehicle_id", vehicleId);

      if (ignore) {
        return;
      }

      if (error) {
        console.error("Could not load vehicle statistics:", error.message);
        setTotalCost(0);
        setRecordCount(0);
        setErrorMessage("Statistics are unavailable right now.");
        setLoading(false);
        return;
      }

      const records = data ?? [];
      const total = records.reduce(
        (sum, record) => sum + (Number(record.cost) || 0),
        0,
      );

      setTotalCost(total);
      setRecordCount(records.length);
      setLoading(false);
    };

    void fetchStats();

    return () => {
      ignore = true;
    };
  }, [vehicleId]);

  const averageCost = recordCount > 0 ? totalCost / recordCount : 0;

  if (loading) {
    return (
      <div
        aria-busy="true"
        aria-label="Loading vehicle statistics"
        className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-lg border border-border bg-surface"
          />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <section
        role="alert"
        className="rounded-lg border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
      >
        {errorMessage}
      </section>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <StatCard
        label="Maintenance Total"
        value={currencyFormatter.format(totalCost)}
        detail="All service records"
        icon={DollarSign}
      />

      <StatCard
        label="Records Logged"
        value={recordCount.toString()}
        detail="Services recorded"
        icon={ClipboardList}
      />

      <StatCard
        label="Avg. Service Cost"
        value={currencyFormatter.format(averageCost)}
        detail="Per service visit"
        icon={Wrench}
      />
    </div>
  );
}

export default VehicleStats;
