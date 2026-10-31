import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Loader2 className="animate-spin text-muted" />
    </div>
  );
}

export function Badge({ tone = "zinc", children }: { tone?: "zinc" | "green" | "amber" | "red" | "sky" | "lime"; children: React.ReactNode }) {
  const t = {
    zinc: "bg-zinc-100 text-zinc-700",
    green: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    amber: "bg-amber-50 text-amber-800 ring-amber-600/15",
    red: "bg-red-50 text-red-700 ring-red-600/15",
    sky: "bg-sky-50 text-sky-700 ring-sky-600/15",
    lime: "bg-lime text-ink",
  }[tone];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-transparent ${t}`}>{children}</span>;
}

export function PageHead({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">{title}</h1>
        {sub && <p className="mt-1 text-muted">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
