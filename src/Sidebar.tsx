type NavItem = {
  label: string;
  icon: string;
  active?: boolean;
  disabled?: boolean;
};

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "⌂", active: true },
  { label: "Vehicles", icon: "▣" },
  { label: "Service History", icon: "⚒" },
  { label: "Fuel Log", icon: "⛽", disabled: true },
  { label: "Expenses", icon: "$", disabled: true },
  { label: "Reminders", icon: "◉", disabled: true },
  { label: "Reports", icon: "▥", disabled: true },
  { label: "Settings", icon: "⚙", disabled: true },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={[
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-neutral-800 bg-neutral-950 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      <div
        className={[
          "flex min-h-24 items-center border-b border-neutral-800",
          collapsed ? "justify-center px-3" : "justify-between px-5",
        ].join(" ")}
      >
        {collapsed ? (
          <span
            aria-label="Dashko"
            className="text-xl font-black tracking-tight text-white"
          >
            D<span className="text-orange-500">.</span>
          </span>
        ) : (
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xl leading-none text-orange-500">⌁</span>

              <span className="text-lg font-bold tracking-tight text-white">
                Dashko<span className="text-orange-500">.app</span>
              </span>
            </div>

            <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-orange-500">
              Vehicle ownership, organized
            </p>
          </div>
        )}

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-800 text-sm text-neutral-400 transition hover:border-orange-500 hover:text-orange-400"
          >
            ←
          </button>
        )}
      </div>

      {collapsed && (
        <div className="flex justify-center border-b border-neutral-800 py-2">
          <button
            type="button"
            onClick={onToggle}
            title="Expand sidebar"
            aria-label="Expand sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-800 text-sm text-neutral-400 transition hover:border-orange-500 hover:text-orange-400"
          >
            →
          </button>
        </div>
      )}

      <nav
        className={["flex-1 space-y-1 py-4", collapsed ? "px-2" : "px-3"].join(
          " ",
        )}
      >
        {navItems.map(({ label, icon, active, disabled }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            title={
              collapsed
                ? disabled
                  ? `${label} — Coming in v2.0`
                  : label
                : disabled
                  ? "Coming in v2.0"
                  : undefined
            }
            className={[
              "flex w-full items-center rounded-lg text-left text-sm font-medium transition-colors",
              collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-2.5",
              active
                ? "border-l-2 border-orange-500 bg-orange-500/10 text-orange-400"
                : "",
              !active && !disabled
                ? "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                : "",
              disabled ? "cursor-not-allowed text-neutral-600" : "",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="flex w-5 shrink-0 justify-center text-base leading-none"
            >
              {icon}
            </span>

            {!collapsed && <span className="truncate">{label}</span>}

            {!collapsed && disabled && (
              <span className="ml-auto rounded border border-neutral-800 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-neutral-600">
                Soon
              </span>
            )}
          </button>
        ))}
      </nav>

      <div
        className={[
          "border-t border-neutral-800",
          collapsed ? "px-2 py-5 text-center" : "px-5 py-5",
        ].join(" ")}
      >
        {collapsed ? (
          <span
            title="Better maintenance. Bigger journeys."
            className="text-lg font-black text-orange-500"
          >
            //
          </span>
        ) : (
          <p className="text-xs font-bold uppercase leading-snug tracking-wide text-neutral-400">
            Better maintenance.
            <br />
            Bigger journeys.
          </p>
        )}
      </div>
    </aside>
  );
}
