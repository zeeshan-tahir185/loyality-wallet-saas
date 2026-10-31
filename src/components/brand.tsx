import Link from "next/link";

export const BRAND = "LoopWallet";

export function Logo({ dark = false, href = "/" }: { dark?: boolean; href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className={`relative grid size-8 place-items-center rounded-[10px] ${dark ? "bg-lime text-ink" : "bg-ink text-lime"}`}>
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="8" cy="12" r="4.2" />
          <circle cx="16" cy="12" r="4.2" />
        </svg>
      </span>
      <span className={`text-[17px] font-semibold tracking-tight ${dark ? "text-white" : "text-ink"}`}>{BRAND}</span>
    </Link>
  );
}

export function AppleWalletBadge({ onClick, small = false }: { onClick?: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl bg-black text-left text-white ring-1 ring-white/20 transition hover:bg-zinc-900 active:scale-[.98] ${small ? "px-3 py-1.5" : "px-4 py-2"}`}
    >
      <svg viewBox="0 0 32 24" className={small ? "h-5" : "h-6"}>
        <rect x="1" y="1" width="30" height="22" rx="4" fill="#fff" />
        <rect x="1" y="4" width="30" height="5" fill="#3ec1f3" />
        <rect x="1" y="8" width="30" height="5" fill="#ffb003" />
        <rect x="1" y="12" width="30" height="5" fill="#ff3b30" />
        <path d="M1 15h9c2 0 3 3 6 3s4-3 6-3h9v4a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4z" fill="#d9d9d9" />
      </svg>
      <span className="leading-none">
        <span className="block text-[9px] opacity-80">Add to</span>
        <span className={`block font-semibold ${small ? "text-[13px]" : "text-[15px]"}`}>Apple Wallet</span>
      </span>
    </button>
  );
}

export function GoogleWalletBadge({ onClick, small = false }: { onClick?: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-full bg-[#1f1f1f] text-white ring-1 ring-white/20 transition hover:bg-black active:scale-[.98] ${small ? "px-3 py-1.5" : "px-4 py-2.5"}`}
    >
      <svg viewBox="0 0 24 24" className={small ? "h-4" : "h-5"}>
        <path d="M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v1H3z" fill="#ea4335" />
        <path d="M3 9h18v3H3z" fill="#fbbc04" />
        <path d="M3 12h18v3H3z" fill="#34a853" />
        <path d="M3 15h18v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z" fill="#4285f4" />
      </svg>
      <span className={`font-medium ${small ? "text-[12px]" : "text-[14px]"}`}>Add to Google Wallet</span>
    </button>
  );
}
