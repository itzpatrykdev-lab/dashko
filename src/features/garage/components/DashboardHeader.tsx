import { useEffect, useRef, useState } from "react";
import { getVehicleLabel, type Vehicle } from "../../../types/vehicle";

type DashboardHeaderProps = {
  vehicles: Vehicle[];
  activeVehicleId: string;
  vehiclesLoading: boolean;
  userEmail: string;
  userName: string;
  userInitial: string;
  onVehicleChange: (vehicleId: string) => void;
  onAddVehicle: () => void;
  onLogService: () => void;
  onLogout: () => Promise<void>;
};

function DashboardHeader({
  vehicles,
  activeVehicleId,
  vehiclesLoading,
  userEmail,
  userName,
  userInitial,
  onVehicleChange,
  onAddVehicle,
  onLogService,
  onLogout,
}: DashboardHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeUserMenuOnOutsideClick = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    const closeUserMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", closeUserMenuOnOutsideClick);
    document.addEventListener("keydown", closeUserMenuOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeUserMenuOnOutsideClick);
      document.removeEventListener("keydown", closeUserMenuOnEscape);
    };
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await onLogout();
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="flex min-h-20 w-full items-center justify-between gap-4 px-6 lg:px-10 xl:px-12">
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex flex-col">
            <label
              htmlFor="active-vehicle"
              className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-accent"
            >
              Active vehicle
            </label>

            <p className="mt-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              {vehicles.length} {vehicles.length === 1 ? "vehicle" : "vehicles"}{" "}
              tracked
            </p>
          </div>

          <div className="relative">
            <select
              id="active-vehicle"
              value={activeVehicleId}
              disabled={vehiclesLoading || vehicles.length === 0}
              onChange={(event) => onVehicleChange(event.target.value)}
              className="w-52 appearance-none rounded-md border border-accent/80 bg-black px-3 py-2.5 pr-10 text-sm font-black uppercase tracking-wide text-text outline-none shadow-[0_0_16px_rgba(249,115,22,0.22)] transition hover:border-accent hover:shadow-[0_0_22px_rgba(249,115,22,0.38)] focus:border-accent focus:ring-2 focus:ring-accent/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {vehicles.length === 0 ? (
                <option value="">No vehicles yet</option>
              ) : (
                vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {getVehicleLabel(vehicle)}
                  </option>
                ))
              )}
            </select>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-accent"
            >
              ▼
            </span>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onLogService}
            className="hidden rounded-md border border-accent px-3 py-2 text-sm font-bold text-accent transition hover:bg-accent hover:text-white lg:inline-flex"
          >
            + Log Service
          </button>

          <button
            type="button"
            onClick={onAddVehicle}
            className="rounded-md bg-accent px-3 py-2 text-sm font-bold text-white transition hover:opacity-90 sm:px-4"
          >
            <span className="hidden sm:inline">+ Add Vehicle</span>
            <span className="sm:hidden">+ Vehicle</span>
          </button>

          <div ref={userMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((open) => !open)}
              aria-expanded={isUserMenuOpen}
              aria-haspopup="menu"
              aria-controls="user-menu"
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-surface"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/50 bg-accent/15 text-sm font-black text-accent">
                {userInitial}
              </span>

              <span className="hidden max-w-35 sm:block">
                <span className="block truncate text-sm font-semibold text-text">
                  {userName}
                </span>

                <span className="block truncate text-xs text-text-muted">
                  {userEmail}
                </span>
              </span>

              <span
                aria-hidden="true"
                className={`hidden text-xs text-text-muted transition-transform sm:inline ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {isUserMenuOpen && (
              <div
                id="user-menu"
                role="menu"
                aria-label="Account menu"
                className="absolute right-0 z-50 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-background shadow-2xl shadow-black/30"
              >
                <div className="border-b border-border px-4 py-3 sm:hidden">
                  <p className="truncate text-sm font-semibold text-text">
                    {userName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-text-muted">
                    {userEmail}
                  </p>
                </div>

                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-danger transition hover:bg-danger hover:text-white"
                >
                  <span aria-hidden="true">↪</span>
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
