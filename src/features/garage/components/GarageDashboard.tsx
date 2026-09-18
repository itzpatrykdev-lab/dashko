import ComingSoonCard from "./ComingSoonCard";
import ServiceHistory from "./ServiceHistory";
import UpcomingMaintenance from "./UpcomingMaintenance";
import VehicleHero from "./VehicleHero";
import VehicleStats from "./VehicleStats";
import type { Vehicle } from "../../../types/vehicle";

type GarageDashboardProps = {
  vehicle: Vehicle;
  refreshTrigger: number;
};

function GarageDashboard({ vehicle, refreshTrigger }: GarageDashboardProps) {
  return (
    <>
      <VehicleHero vehicle={vehicle} />

      <VehicleStats vehicleId={vehicle.id} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)] xl:items-start">
        <ServiceHistory
          vehicleId={vehicle.id}
          refreshTrigger={refreshTrigger}
        />

        <div className="space-y-6">
          <UpcomingMaintenance
            vehicleId={vehicle.id}
            currentMileage={vehicle.current_mileage}
          />

          <ComingSoonCard
            eyebrow="Coming next"
            title="Fuel & Spending"
            description="Fuel tracking, lifetime MPG, fuel cost trends, and a complete spending breakdown will appear here in Dashko v2.0."
            badge="Planned for v2.0"
          />
        </div>
      </div>
    </>
  );
}

export default GarageDashboard;
