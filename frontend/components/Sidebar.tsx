import Link from "next/link";
import { LayoutDashboard, ArrowLeftRight, CreditCard, Building, Wallet } from "lucide-react";

export function Sidebar() {
  const items = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/transfers", label: "Transfers", icon: ArrowLeftRight },
    { href: "/cards", label: "Cards", icon: CreditCard },
    { href: "/accounts", label: "Accounts", icon: Building },
    { href: "/wallet", label: "Wallet", icon: Wallet }
  ];
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <div className="font-bold mb-6">Fintech</div>
      <nav className="space-y-1">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-2 rounded px-2 py-2 hover:bg-accent">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}