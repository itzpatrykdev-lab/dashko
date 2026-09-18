type EmptyGarageStateProps = {
  onAddVehicle: () => void;
};

function EmptyGarageState({ onAddVehicle }: EmptyGarageStateProps) {
  return (
    <section className="relative overflow-hidden rounded-xl border border-border bg-background px-6 py-12 sm:px-10 sm:py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.13),transparent_45%)]" />

      <div className="relative max-w-xl">
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          Your garage is ready
        </p>

        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-text sm:text-4xl">
          Add your first vehicle
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-6 text-text-muted sm:text-base">
          Start tracking maintenance, service history, mileage, and ownership
          details for every vehicle you drive.
        </p>

        <button
          type="button"
          onClick={onAddVehicle}
          className="mt-7 inline-flex items-center rounded-md bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background"
        >
          + Add your first vehicle
        </button>
      </div>
    </section>
  );
}

export default EmptyGarageState;
