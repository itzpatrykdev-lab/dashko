import { Fuel } from "lucide-react";
import SectionHeader from "../../../components/ui/SectionHeader";

type ComingSoonCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
};

function ComingSoonCard({
  eyebrow,
  title,
  description,
  badge,
}: ComingSoonCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-background">
      <SectionHeader eyebrow={eyebrow} title={title} icon={Fuel} />

      <div className="px-5 py-6">
        <p className="text-sm font-medium text-text">
          Better ownership insights are on the way.
        </p>

        <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>

        <span className="mt-5 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-accent">
          {badge}
        </span>
      </div>
    </section>
  );
}

export default ComingSoonCard;
