import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./lib/supabaseClient";
import AddServiceRecord from "./features/garage/components/AddServiceRecord";
import AddVehicle from "./features/garage/components/AddVehicle";
import Auth from "./Auth";
import DashboardHeader from "./features/garage/components/DashboardHeader";
import DashboardLayout from "./DashboardLayout";
import EmptyGarageState from "./features/garage/components/EmptyGarageState";
import GarageDashboard from "./features/garage/components/GarageDashboard";
import Modal from "./components/ui/Modal";
import VehicleList from "./features/garage/components/VehicleList";
import type { Vehicle } from "./types/vehicle";

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);
  const [vehiclesError, setVehiclesError] = useState<string | null>(null);
  const [activeVehicleId, setActiveVehicleId] = useState("");

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showLogService, setShowLogService] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" });

    if (error) {
      console.error("Could not log out:", error.message);
    }
  };

  useEffect(() => {
    if (vehicles.length === 0) {
      setActiveVehicleId("");
      return;
    }

    const activeVehicleStillExists = vehicles.some(
      (vehicle) => vehicle.id === activeVehicleId,
    );

    if (!activeVehicleId || !activeVehicleStillExists) {
      setActiveVehicleId(vehicles[0].id);
    }
  }, [vehicles, activeVehicleId]);

  useEffect(() => {
    let ignore = false;

    if (!session) {
      setVehicles([]);
      setVehiclesError(null);
      setVehiclesLoading(false);

      return () => {
        ignore = true;
      };
    }

    const fetchVehicles = async () => {
      setVehiclesLoading(true);
      setVehiclesError(null);

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (ignore) {
        return;
      }

      if (error) {
        console.error("Could not load vehicles:", error.message);
        setVehicles([]);
        setVehiclesError("We could not load your vehicles. Please try again.");
        setVehiclesLoading(false);
        return;
      }

      setVehicles((data ?? []) as Vehicle[]);
      setVehiclesLoading(false);
    };

    void fetchVehicles();

    return () => {
      ignore = true;
    };
  }, [session, refreshTrigger]);

  const activeVehicle =
    vehicles.find((vehicle) => vehicle.id === activeVehicleId) ?? null;

  const userEmail = session?.user.email ?? "";
  const userName = userEmail.split("@")[0] || "Driver";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleVehicleAdded = () => {
    setRefreshTrigger((previous) => previous + 1);
    setShowAddVehicle(false);
  };

  const handleServiceRecordAdded = () => {
    setRefreshTrigger((previous) => previous + 1);
    setShowLogService(false);
  };

  const handleVehicleChanged = () => {
    setRefreshTrigger((previous) => previous + 1);
  };

  return (
    <DashboardLayout>
      {(activePage) => (
        <>
          <DashboardHeader
            vehicles={vehicles}
            activeVehicleId={activeVehicleId}
            vehiclesLoading={vehiclesLoading}
            userEmail={userEmail}
            userName={userName}
            userInitial={userInitial}
            onVehicleChange={setActiveVehicleId}
            onAddVehicle={() => setShowAddVehicle(true)}
            onLogService={() => setShowLogService(true)}
            onLogout={handleLogout}
          />
          <main className="w-full px-6 py-6 lg:px-10 lg:py-7 xl:px-12">
            <div className="flex flex-col gap-6 lg:gap-7">
              {session ? (
                <>
                  {vehiclesError && (
                    <section
                      role="alert"
                      className="flex flex-col gap-3 rounded-xl border border-danger/40 bg-danger/10 p-5 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-danger">
                          Garage unavailable
                        </p>

                        <p className="mt-1 text-sm text-text-muted">
                          {vehiclesError}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setRefreshTrigger((previous) => previous + 1)
                        }
                        className="inline-flex w-fit rounded-md border border-danger px-3 py-2 text-sm font-bold text-danger transition hover:bg-danger hover:text-white"
                      >
                        Try again
                      </button>
                    </section>
                  )}
                  {activePage === "dashboard" && (
                    <>
                      {vehiclesLoading ? (
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
                      ) : activeVehicle ? (
                        <GarageDashboard
                          vehicle={activeVehicle}
                          refreshTrigger={refreshTrigger}
                        />
                      ) : !vehiclesError ? (
                        <EmptyGarageState
                          onAddVehicle={() => setShowAddVehicle(true)}
                        />
                      ) : null}
                    </>
                  )}

                  {activePage === "vehicles" && (
                    <section className="space-y-6">
                      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                            Garage
                          </p>

                          <h1 className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
                            Your Vehicles
                          </h1>

                          <p className="mt-1 text-sm text-text-muted">
                            Manage the vehicles in your garage.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowAddVehicle(true)}
                          className="inline-flex w-fit items-center justify-center rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent/90"
                        >
                          Add vehicle
                        </button>
                      </div>

                      <VehicleList
                        vehicles={vehicles}
                        loading={vehiclesLoading}
                        onVehicleChanged={handleVehicleChanged}
                        refreshTrigger={refreshTrigger}
                      />
                    </section>
                  )}

                  {activePage === "service-history" && (
                    <section className="rounded-xl border border-border bg-background px-6 py-12 text-center">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                        Service History
                      </p>

                      <h1 className="mt-3 text-xl font-bold text-text-primary">
                        Service history is next
                      </h1>

                      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
                        Your logged maintenance records will live here in a
                        dedicated view.
                      </p>
                    </section>
                  )}

                  <Modal
                    isOpen={showAddVehicle}
                    onClose={() => setShowAddVehicle(false)}
                    title="Add a Vehicle"
                  >
                    <AddVehicle
                      session={session}
                      onVehicleAdded={handleVehicleAdded}
                    />
                  </Modal>

                  <Modal
                    isOpen={showLogService}
                    onClose={() => setShowLogService(false)}
                    title="Log a Service"
                  >
                    <AddServiceRecord
                      session={session}
                      vehicles={vehicles}
                      onRecordAdded={handleServiceRecordAdded}
                    />
                  </Modal>
                </>
              ) : (
                <Auth />
              )}
            </div>
          </main>
        </>
      )}
    </DashboardLayout>
  );
}

export default App;
