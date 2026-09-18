import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

function SectionHeader({
  eyebrow,
  title,
  icon: Icon,
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-accent/30 bg-accent/10 text-accent">
            <Icon size={18} strokeWidth={2.4} aria-hidden="true" />
          </span>
        ) : null}

        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
              {eyebrow}
            </p>
          ) : null}

          <h2 className="mt-1 text-xl font-black uppercase tracking-tight text-text">
            {title}
          </h2>
        </div>
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export default SectionHeader;
