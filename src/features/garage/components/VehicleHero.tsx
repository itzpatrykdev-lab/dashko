import cityHeroBackground from "../../../assets/city-hero-background.png";

type Vehicle = {
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
  image_url: string | null;
};

type VehicleHeroProps = {
  vehicle: Vehicle;
};

function formatMileage(mileage: number | null) {
  if (mileage === null || mileage === undefined) {
    return "—";
  }

  return new Intl.NumberFormat("en-US").format(mileage);
}

function getVehicleTitle(vehicle: Vehicle) {
  if (vehicle.nickname?.trim()) {
    return vehicle.nickname.trim().toUpperCase();
  }

  return [vehicle.year, vehicle.make, vehicle.model]
    .filter((value): value is string | number => Boolean(value))
    .join(" ")
    .toUpperCase();
}

function getVehicleDetails(vehicle: Vehicle) {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .filter((value): value is string | number => Boolean(value))
    .join(" ");
}

export default function VehicleHero({ vehicle }: VehicleHeroProps) {
  const title = getVehicleTitle(vehicle);
  const details = getVehicleDetails(vehicle);

  return (
    <section className="relative isolate overflow-hidden rounded-xl border border-orange-500/30 bg-neutral-950 shadow-xl shadow-orange-950/20">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cityHeroBackground})` }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black via-black/75 to-transparent lg:w-[58%]"
      />

      {vehicle.image_url && (
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] lg:block">
          {/* Warm ambient glow behind the car */}
          <div
            aria-hidden="true"
            className="absolute bottom-[12%] right-[7%] h-[44%] w-[76%] rounded-full bg-orange-500/25 blur-3xl"
          />

          {/* Ground/contact shadow beneath the car */}
          <div
            aria-hidden="true"
            className="absolute bottom-[8%] right-[7%] h-[13%] w-[78%] rounded-[50%] bg-black/60 blur-xl"
          />

          <img
            src={vehicle.image_url}
            alt=""
            className="absolute bottom-[-55%] right-[-3%] h-[200%] w-[200%] max-w-none object-contain object-right brightness-90 contrast-110 saturate-110 drop-shadow-[0_18px_18px_rgba(0,0,0,0.5)]"
          />

          {/* Warm city-light color grade, low enough to preserve paint color */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-orange-500/10 mix-blend-color pointer-events-none"
          />
        </div>
      )}

      <div className="relative p-6 sm:p-8">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-orange-100/85">
            Active vehicle
          </p>

          <div className="mt-2 flex flex-wrap items-start gap-3">
            <h1 className="font-black uppercase leading-[0.9] tracking-tight text-white text-4xl sm:text-5xl lg:text-6xl">
              {title}
            </h1>

            {vehicle.trim && (
              <span className="mt-1 rounded-md border border-white/25 bg-black/25 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                {vehicle.trim}
              </span>
            )}
          </div>

          <p className="mt-4 max-w-2xl text-sm font-medium text-orange-50/90 sm:text-base">
            {details}
          </p>

          <div className="mt-7 flex w-full flex-wrap gap-x-6 gap-y-3 border-t border-white/20 pt-5 lg:w-[48%]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-100/70">
                Odometer
              </p>
              <p className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {formatMileage(vehicle.current_mileage)}
                <span className="ml-1 text-sm font-bold text-orange-100/80">
                  mi
                </span>
              </p>
            </div>

            <div className="hidden h-12 w-px self-end bg-white/20 sm:block" />

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-100/70">
                Maintenance status
              </p>

              <div className="mt-2 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.85)]"
                />
                <span className="text-sm font-bold uppercase tracking-wide text-white">
                  Systems tracked
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
